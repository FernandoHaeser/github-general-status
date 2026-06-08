import Image from "next/image";
import { getStats } from "@/lib/github";

/* ── helpers ── */
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function PixelCard({
  children,
  className = "",
  variant = "green",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "green" | "blue" | "yellow" | "purple";
}) {
  return (
    <div
      className={`relative bg-card p-4 pixel-border-${variant} pixel-border card-hover slide-in ${className}`}
      style={{ backgroundColor: "var(--card)" }}
    >
      {children}
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-1 p-3 bg-card slide-in"
      style={{
        backgroundColor: "var(--card)",
        border: `2px solid ${color}`,
        boxShadow: `0 0 8px ${color}44`,
        minWidth: "90px",
      }}
    >
      <span style={{ fontSize: "18px", lineHeight: 1 }}>{icon}</span>
      <span
        className="font-vt"
        style={{ fontSize: "28px", color, lineHeight: 1, fontFamily: "var(--font-vt), monospace" }}
      >
        {value}
      </span>
      <span style={{ fontSize: "7px", color: "#7d8590", letterSpacing: "0.05em" }}>
        {label}
      </span>
    </div>
  );
}

function LangBar({
  name,
  pct,
  color,
  delay,
}: {
  name: string;
  pct: number;
  color: string;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-3" style={{ animationDelay: `${delay}ms` }}>
      <span
        style={{
          width: "100px",
          fontSize: "8px",
          color: "#c9d1d9",
          flexShrink: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
      <div
        style={{
          flex: 1,
          height: "10px",
          background: "#161b22",
          border: "1px solid #21262d",
          overflow: "hidden",
        }}
      >
        <div
          className="bar-fill"
          style={
            {
              height: "100%",
              background: color,
              boxShadow: `0 0 6px ${color}88`,
              "--bar-width": `${pct}%`,
            } as React.CSSProperties
          }
        />
      </div>
      <span
        className="font-vt"
        style={{
          width: "36px",
          fontSize: "16px",
          color,
          textAlign: "right",
          flexShrink: 0,
          fontFamily: "var(--font-vt), monospace",
        }}
      >
        {pct}%
      </span>
    </div>
  );
}

function RepoCard({ repo }: { repo: { name: string; description: string | null; html_url: string; stargazers_count: number; forks_count: number; language: string | null } }) {
  const LANG_COLORS: Record<string, string> = {
    TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
    Java: "#b07219", "C#": "#178600", Go: "#00ADD8", Rust: "#dea584",
    PHP: "#4F5D95", Ruby: "#701516", HTML: "#e34c26", CSS: "#563d7c",
    Vue: "#41b883", Kotlin: "#A97BFF", Swift: "#F05138",
  };
  const lc = repo.language ? (LANG_COLORS[repo.language] ?? "#8b949e") : "#8b949e";

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="repo-card slide-in"
      style={{
        display: "block",
        backgroundColor: "var(--card)",
        padding: "14px",
        textDecoration: "none",
      }}
    >
      <div style={{ fontSize: "9px", color: "var(--blue)", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        ▶ {repo.name}
      </div>
      <div style={{ fontSize: "8px", color: "#7d8590", marginBottom: "10px", minHeight: "24px", lineHeight: 1.5 }}>
        {repo.description
          ? repo.description.length > 50
            ? repo.description.slice(0, 50) + "..."
            : repo.description
          : "—"}
      </div>
      <div className="flex items-center gap-3">
        {repo.language && (
          <span style={{ fontSize: "7px", color: lc }}>
            ● {repo.language}
          </span>
        )}
        <span style={{ fontSize: "8px", color: "var(--yellow)" }}>★ {repo.stargazers_count}</span>
        <span style={{ fontSize: "8px", color: "#7d8590" }}>⑂ {repo.forks_count}</span>
      </div>
    </a>
  );
}

/* ── Page ── */
export default async function Page() {
  const stats = await getStats();
  const { user, totalStars, totalForks, languages, topRepos, level, expPct, accountYears } = stats;

  const joinYear = new Date(user.created_at).getFullYear();

  return (
    <main
      className="boot-flicker"
      style={{ minHeight: "100vh", background: "var(--bg)", padding: "0 16px 40px" }}
    >
      {/* Moving scanline */}
      <div className="scan-line" />

      {/* ── TOP NAV BAR ── */}
      <div
        style={{
          borderBottom: "3px solid var(--green)",
          background: "#050a0f",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
          boxShadow: "0 0 20px rgba(0,255,65,0.2)",
          marginBottom: "32px",
        }}
      >
        <div className="flex items-center gap-3">
          <span style={{ color: "var(--green)", fontSize: "9px" }}>▓▓▓</span>
          <span className="glow-green" style={{ fontSize: "11px", letterSpacing: "0.1em" }}>
            GITHUB STATS.EXE
          </span>
          <span style={{ color: "var(--green)", fontSize: "9px" }}>▓▓▓</span>
        </div>

        <div className="flex items-center gap-4">
          <span style={{ fontSize: "8px", color: "#7d8590" }}>v1.0.0</span>
          <div className="flex items-center gap-1" style={{ fontSize: "8px", color: "var(--yellow)" }}>
            <span className="blink">▶</span>
            <span>INSERT COIN</span>
            <span className="blink">◀</span>
          </div>
          <span style={{ fontSize: "8px", color: "#7d8590" }}>© FERNANDOHAESER</span>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* ── PLAYER CARD + STATS ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: "20px",
            marginBottom: "24px",
          }}
          className="player-grid"
        >
          {/* Player card */}
          <PixelCard variant="green" className="flex flex-col gap-3">
            {/* Corner pixel decorations */}
            <span style={{ position: "absolute", top: 4, left: 4, color: "var(--green)", fontSize: "7px", opacity: 0.5 }}>▓</span>
            <span style={{ position: "absolute", top: 4, right: 4, color: "var(--green)", fontSize: "7px", opacity: 0.5 }}>▓</span>
            <span style={{ position: "absolute", bottom: 4, left: 4, color: "var(--green)", fontSize: "7px", opacity: 0.5 }}>▓</span>
            <span style={{ position: "absolute", bottom: 4, right: 4, color: "var(--green)", fontSize: "7px", opacity: 0.5 }}>▓</span>

            <div style={{ fontSize: "8px", color: "var(--green)", marginBottom: "4px", letterSpacing: "0.15em" }}>
              PLAYER SELECT
            </div>

            {/* Avatar — pixelated at 64px so it looks 8-bit */}
            <div className="flex items-center gap-3">
              <div style={{ position: "relative", flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar_url + "&s=64"}
                  alt={user.login}
                  className="pixel-img"
                  width={64}
                  height={64}
                  style={{
                    border: "3px solid var(--green)",
                    boxShadow: "0 0 12px rgba(0,255,65,0.4)",
                    imageRendering: "pixelated",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: -4,
                    right: -4,
                    background: "var(--yellow)",
                    color: "#000",
                    fontSize: "7px",
                    padding: "1px 4px",
                    fontFamily: "var(--font-pixel), monospace",
                  }}
                >
                  LV{pad(level)}
                </span>
              </div>

              <div>
                <div style={{ fontSize: "10px", color: "#ffffff", marginBottom: "4px" }}>
                  {user.name ?? user.login}
                </div>
                <div style={{ fontSize: "7px", color: "var(--cyan)", marginBottom: "2px" }}>
                  @{user.login}
                </div>
                <div style={{ fontSize: "7px", color: "#7d8590" }}>
                  CLASS: SOFTWARE DEV
                </div>
              </div>
            </div>

            <hr className="pixel-divider" />

            {/* Bio */}
            {user.bio && (
              <div style={{ fontSize: "7px", color: "#c9d1d9", lineHeight: 1.7 }}>
                &quot;{user.bio}&quot;
              </div>
            )}

            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <span style={{ fontSize: "7px", color: "#7d8590" }}>
                📍 {user.location ?? "Brazil 🇧🇷"}
              </span>
              <span style={{ fontSize: "7px", color: "#7d8590" }}>
                📅 JOINED: {joinYear} ({accountYears}y AGO)
              </span>
              <span style={{ fontSize: "7px", color: "#7d8590" }}>
                👥 {user.followers} FOLLOWERS · {user.following} FOLLOWING
              </span>
            </div>

            <hr className="pixel-divider" />

            {/* EXP bar */}
            <div>
              <div
                className="flex justify-between"
                style={{ fontSize: "7px", marginBottom: "4px" }}
              >
                <span style={{ color: "var(--yellow)" }}>EXP</span>
                <span style={{ color: "var(--yellow)" }}>{expPct}/100</span>
              </div>
              <div
                style={{
                  height: "10px",
                  background: "#161b22",
                  border: "1px solid #21262d",
                  overflow: "hidden",
                }}
              >
                <div
                  className="bar-fill"
                  style={
                    {
                      height: "100%",
                      background: "var(--yellow)",
                      boxShadow: "0 0 6px rgba(255,215,0,0.7)",
                      "--bar-width": `${expPct}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>
          </PixelCard>

          {/* Stats panel */}
          <PixelCard variant="blue">
            <div style={{ fontSize: "8px", color: "var(--blue)", marginBottom: "14px", letterSpacing: "0.15em" }}>
              ── STATUS SCREEN ──────────────────────────────
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
              }}
            >
              <StatBox icon="⭐" label="TOTAL STARS"    value={totalStars}           color="var(--yellow)" />
              <StatBox icon="📦" label="REPOS"          value={user.public_repos}    color="var(--blue)"   />
              <StatBox icon="👥" label="FOLLOWERS"      value={user.followers}       color="var(--green)"  />
              <StatBox icon="⑂"  label="TOTAL FORKS"   value={totalForks}           color="var(--cyan)"   />
              <StatBox icon="📜" label="GISTS"          value={user.public_gists}    color="var(--purple)" />
              <StatBox icon="🗓" label="YEARS ACTIVE"   value={accountYears}         color="var(--red)"    />
            </div>
          </PixelCard>
        </div>

        {/* ── LANGUAGES ── */}
        <PixelCard variant="purple" className="mb-6">
          <div style={{ fontSize: "8px", color: "var(--purple)", marginBottom: "16px", letterSpacing: "0.15em" }}>
            ── TOP LANGUAGES ──────────────────────────────
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {languages.map((l, i) => (
              <LangBar
                key={l.name}
                name={l.name}
                pct={l.pct}
                color={l.color}
                delay={i * 80}
              />
            ))}
          </div>
        </PixelCard>

        {/* ── TOP REPOS ── */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              fontSize: "8px",
              color: "var(--yellow)",
              letterSpacing: "0.15em",
              marginBottom: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span className="blink">▶</span>
            <span>TOP REPOS</span>
            <span style={{ flex: 1, borderTop: "1px dashed rgba(255,215,0,0.2)", marginLeft: "8px" }} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "12px",
            }}
          >
            {topRepos.map((r) => (
              <RepoCard key={r.name} repo={r} />
            ))}
          </div>
        </div>

        {/* ── GITHUB STREAK + ACTIVITY (external embeds) ── */}
        <PixelCard variant="green" className="mb-6">
          <div style={{ fontSize: "8px", color: "var(--green)", marginBottom: "16px", letterSpacing: "0.15em" }}>
            ── STREAK & ACTIVITY ──────────────────────────
          </div>
          <div className="flex flex-col items-center gap-6">
            {/* Streak */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://streak-stats.demolab.com?user=FernandoHaeser&theme=dark&hide_border=true&background=0A0F1A&stroke=00ff41&ring=00ff41&fire=ffd700&currStreakNum=ffffff&sideNums=ffffff&currStreakLabel=00ff41&sideLabels=7d8590&dates=7d8590"
              alt="GitHub Streak"
              style={{ maxWidth: "100%", border: "2px solid #21262d" }}
            />
            {/* Activity graph */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github-readme-activity-graph.vercel.app/graph?username=FernandoHaeser&theme=github-dark&hide_border=true&area=true&color=00ff41&line=00ff41&point=ffd700&area_color=00ff4122"
              alt="Activity Graph"
              style={{ maxWidth: "100%", width: "100%", border: "2px solid #21262d" }}
            />
          </div>
        </PixelCard>

        {/* ── TROPHIES ── */}
        <PixelCard variant="yellow" className="mb-6">
          <div style={{ fontSize: "8px", color: "var(--yellow)", marginBottom: "16px", letterSpacing: "0.15em" }}>
            ── ACHIEVEMENTS ───────────────────────────────
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://github-profile-trophy.vercel.app/?username=FernandoHaeser&theme=darkhub&no-frame=true&margin-w=8&margin-h=8&column=7&no-bg=true"
            alt="Trophies"
            style={{ maxWidth: "100%", width: "100%" }}
          />
        </PixelCard>

        {/* ── SUMMARY CARDS ── */}
        <PixelCard variant="blue" className="mb-6">
          <div style={{ fontSize: "8px", color: "var(--blue)", marginBottom: "16px", letterSpacing: "0.15em" }}>
            ── PROFILE SUMMARY ────────────────────────────
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="http://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=FernandoHaeser&theme=github_dark" alt="Repos per Language" style={{ height: "120px" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="http://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=FernandoHaeser&theme=github_dark" alt="Most Commit Language" style={{ height: "120px" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="http://github-profile-summary-cards.vercel.app/api/cards/stats?username=FernandoHaeser&theme=github_dark" alt="Stats" style={{ height: "120px" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="http://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=FernandoHaeser&theme=github_dark&utcOffset=-3" alt="Productive Time" style={{ height: "120px" }} />
          </div>
          <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="http://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=FernandoHaeser&theme=github_dark" alt="Profile Details" style={{ maxWidth: "100%" }} />
          </div>
        </PixelCard>

        {/* ── FOOTER ── */}
        <div
          style={{
            borderTop: "3px solid var(--green)",
            background: "#050a0f",
            padding: "20px",
            marginTop: "8px",
            boxShadow: "0 0 20px rgba(0,255,65,0.15)",
          }}
        >
          {/* Contact */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            {[
              { label: "GMAIL",     href: "mailto:fernandohaeserr@gmail.com", color: "#EA4335" },
              { label: "DISCORD",   href: "https://discord.gg/fefedaplay",    color: "#5865F2" },
              { label: "LINKEDIN",  href: "https://www.linkedin.com/in/fehaeser/", color: "#0A66C2" },
              { label: "INSTAGRAM", href: "https://www.instagram.com/devhaeser/", color: "#E1306C" },
              { label: "GITHUB",    href: `https://github.com/${user.login}`, color: "var(--green)" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
                style={{
                  fontSize: "8px",
                  padding: "6px 14px",
                  border: `2px solid ${l.color}`,
                  color: l.color,
                  textDecoration: "none",
                  letterSpacing: "0.1em",
                  boxShadow: `0 0 8px ${l.color}44`,
                }}
              >
                [{l.label}]
              </a>
            ))}
          </div>

          {/* Profile views + signature */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://komarev.com/ghpvc/?username=FernandoHaeser&style=flat-square&color=00ff41&label=PROFILE+VIEWS&labelColor=0a0f1a"
              alt="Profile Views"
              style={{ height: "20px" }}
            />
            <span style={{ fontSize: "7px", color: "#7d8590" }}>
              ©{new Date().getFullYear()} FERNANDOHAESER
              <span className="blink" style={{ marginLeft: "4px", color: "var(--green)" }}>█</span>
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}
