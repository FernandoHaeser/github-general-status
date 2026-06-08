import { NextResponse } from "next/server";
import { getStats } from "@/lib/github";

export const revalidate = 21600;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const { user, totalStars, totalForks, languages, level, expPct } = await getStats();

  // Embed avatar as base64 (required — GitHub blocks external src in <img> SVGs)
  let avatarHref = "";
  try {
    const res = await fetch(user.avatar_url + "&s=72", { next: { revalidate: 21600 } });
    const mime = res.headers.get("content-type") ?? "image/jpeg";
    const b64 = Buffer.from(await res.arrayBuffer()).toString("base64");
    avatarHref = `data:${mime};base64,${b64}`;
  } catch { /* skip avatar on error */ }

  const W = 495;
  const H = 345;
  const topLangs = languages.slice(0, 5);
  const BAR_X = 140;
  const BAR_W = 300;
  const EXP_W = 340;
  const LV = String(level).padStart(2, "0");
  const FONT = "system-ui, -apple-system, sans-serif";

  // Per-bar scale animation (scaleX on fill-box so origin is left edge of each bar)
  const barCSS = topLangs
    .map((l, i) => {
      const finalW = Math.round((l.pct / 100) * BAR_W);
      const delay = (0.35 + i * 0.12).toFixed(2);
      return (
        `.b${i}{` +
        `animation:ba${i} 0.9s ${delay}s ease-out both;` +
        `transform-origin:left center;transform-box:fill-box}` +
        `@keyframes ba${i}{from{transform:scaleX(0)}to{transform:scaleX(1)}}` +
        // hidden initial state before animation fires
        `.b${i}{transform:scaleX(0)}` +
        // use data-w to carry final rect width — set in the rect's width attribute
        // The animation target width is the rect's own width (transform-box:fill-box)
        // so no extra calc needed.
        `.b${i}-w{width:${finalW}px}`
      );
    })
    .join("");

  const expFinalW = Math.round((expPct / 100) * EXP_W);
  const expCSS =
    `.exp{animation:expa 1.1s 0.2s ease-out both;transform-origin:left center;transform-box:fill-box}` +
    `@keyframes expa{from{transform:scaleX(0)}to{transform:scaleX(1)}}` +
    `.exp{transform:scaleX(0)}`;

  const langRows = topLangs
    .map((l, i) => {
      const textY = 200 + i * 22;
      const barTop = textY - 10;
      const barW = Math.round((l.pct / 100) * BAR_W);
      return `
  <text x="24" y="${textY}" font-family="${FONT}" font-size="11" fill="#8b949e">${esc(l.name)}</text>
  <rect x="${BAR_X}" y="${barTop}" width="${BAR_W}" height="8" rx="4" fill="#21262d"/>
  <rect x="${BAR_X}" y="${barTop}" width="${barW}" height="8" rx="4" fill="${l.color}" class="b${i}"/>
  <text x="${BAR_X + BAR_W + 8}" y="${textY}" font-family="${FONT}" font-size="11" fill="${l.color}">${l.pct}%</text>`;
    })
    .join("\n");

  const statsRow = [
    { label: "Stars",     value: totalStars,        color: "#f0883e", cx: 80  },
    { label: "Repos",     value: user.public_repos,  color: "#58a6ff", cx: 200 },
    { label: "Followers", value: user.followers,     color: "#3fb950", cx: 320 },
    { label: "Forks",     value: totalForks,         color: "#a371f7", cx: 440 },
  ]
    .map(
      (s) =>
        `  <text x="${s.cx}" y="128" text-anchor="middle" font-family="${FONT}" font-size="22" font-weight="700" fill="${s.color}">${s.value}</text>\n` +
        `  <text x="${s.cx}" y="148" text-anchor="middle" font-family="${FONT}" font-size="10" fill="#6e7681">${s.label}</text>`
    )
    .join("\n");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <clipPath id="av"><circle cx="56" cy="48" r="30"/></clipPath>
  <linearGradient id="gr" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#58a6ff"/>
    <stop offset="100%" stop-color="#a371f7"/>
  </linearGradient>
  <style>
    .fade{animation:fi 0.5s ease-out both}
    @keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
    ${barCSS}
    ${expCSS}
  </style>
</defs>

<!-- background -->
<rect width="${W}" height="${H}" rx="10" fill="#0d1117"/>
<rect width="${W}" height="${H}" rx="10" fill="none" stroke="#30363d" stroke-width="1"/>

<!-- gradient top accent -->
<rect width="${W}" height="3" rx="0" fill="url(#gr)"/>

<!-- avatar -->
${
  avatarHref
    ? `<image x="24" y="16" width="64" height="64" href="${avatarHref}" clip-path="url(#av)" preserveAspectRatio="xMidYMid slice"/>`
    : `<circle cx="56" cy="48" r="30" fill="#21262d"/>`
}
<circle cx="56" cy="48" r="30" fill="none" stroke="#30363d" stroke-width="1.5"/>

<!-- name & login -->
<text x="104" y="36" font-family="${FONT}" font-size="17" font-weight="700" fill="#e6edf3" class="fade">${esc(user.name ?? user.login)}</text>
<text x="104" y="54" font-family="${FONT}" font-size="12" fill="#8b949e">@${esc(user.login)}</text>
${user.bio ? `<text x="104" y="70" font-family="${FONT}" font-size="11" fill="#8b949e">${esc(user.bio.length > 55 ? user.bio.slice(0, 55) + "…" : user.bio)}</text>` : ""}

<!-- level pill -->
<rect x="416" y="18" width="55" height="22" rx="11" fill="#1c2128" stroke="#30363d" stroke-width="1"/>
<text x="443" y="33" text-anchor="middle" font-family="${FONT}" font-size="11" font-weight="600" fill="#a371f7">LV ${LV}</text>

<!-- separator 1 -->
<line x1="24" y1="96" x2="471" y2="96" stroke="#21262d" stroke-width="1"/>

<!-- stats -->
${statsRow}

<!-- separator 2 -->
<line x1="24" y1="164" x2="471" y2="164" stroke="#21262d" stroke-width="1"/>

<!-- languages header -->
<text x="24" y="180" font-family="${FONT}" font-size="10" font-weight="600" fill="#6e7681" letter-spacing="1">TOP LANGUAGES</text>

<!-- language bars -->
${langRows}

<!-- separator 3 -->
<line x1="24" y1="302" x2="471" y2="302" stroke="#21262d" stroke-width="1"/>

<!-- xp section -->
<text x="24" y="320" font-family="${FONT}" font-size="10" font-weight="600" fill="#6e7681" letter-spacing="1">XP PROGRESS</text>
<text x="${24 + EXP_W + 8}" y="320" font-family="${FONT}" font-size="10" fill="#8b949e">${expPct} / 100</text>
<rect x="24" y="326" width="${EXP_W}" height="6" rx="3" fill="#21262d"/>
<rect x="24" y="326" width="${expFinalW}" height="6" rx="3" fill="url(#gr)" class="exp"/>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=21600, s-maxage=21600, stale-while-revalidate=86400",
    },
  });
}
