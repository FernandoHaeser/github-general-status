import { getStats } from "@/lib/github";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Java: "#b07219", "C#": "#178600", Go: "#00ADD8", Rust: "#dea584",
  PHP: "#4F5D95", Ruby: "#701516", HTML: "#e34c26", CSS: "#563d7c",
  Vue: "#41b883", Kotlin: "#A97BFF", Swift: "#F05138",
};

function LangBar({ name, pct, color, delay }: { name: string; pct: number; color: string; delay: number }) {
  return (
    <div className="flex items-center gap-3">
      <span style={{ width: "108px", fontSize: "13px", color: "var(--text-2)", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {name}
      </span>
      <div style={{ flex: 1, height: "6px", background: "var(--border-subtle)", borderRadius: "3px", overflow: "hidden" }}>
        <div
          className="bar-fill"
          style={{ height: "100%", background: color, borderRadius: "3px", "--bar-width": `${pct}%`, animationDelay: `${delay}ms` } as React.CSSProperties}
        />
      </div>
      <span style={{ width: "38px", fontSize: "13px", color, textAlign: "right", flexShrink: 0 }}>
        {pct}%
      </span>
    </div>
  );
}

function RepoCard({ repo }: { repo: { name: string; description: string | null; html_url: string; stargazers_count: number; forks_count: number; language: string | null } }) {
  const lc = repo.language ? (LANG_COLORS[repo.language] ?? "#8b949e") : "#8b949e";
  return (
    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-card fade-up">
      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--blue)", marginBottom: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {repo.name}
      </div>
      <div style={{ fontSize: "12px", color: "var(--text-2)", marginBottom: "12px", minHeight: "36px", lineHeight: 1.6 }}>
        {repo.description
          ? repo.description.length > 65 ? repo.description.slice(0, 65) + "…" : repo.description
          : <span style={{ color: "var(--text-3)" }}>No description</span>}
      </div>
      <div className="flex items-center gap-3">
        {repo.language && <span style={{ fontSize: "12px", color: lc }}>● {repo.language}</span>}
        <span style={{ fontSize: "12px", color: "var(--orange)" }}>★ {repo.stargazers_count}</span>
        <span style={{ fontSize: "12px", color: "var(--text-3)" }}>⑂ {repo.forks_count}</span>
      </div>
    </a>
  );
}

export default async function Page() {
  const stats = await getStats();
  const { user, totalStars, totalForks, languages, topRepos, level, expPct, accountYears } = stats;
  const joinYear = new Date(user.created_at).getFullYear();
  const lv = String(level).padStart(2, "0");

  const statItems = [
    { label: "Stars",       value: totalStars,        color: "var(--orange)" },
    { label: "Repos",       value: user.public_repos,  color: "var(--blue)"   },
    { label: "Followers",   value: user.followers,     color: "var(--green)"  },
    { label: "Forks",       value: totalForks,         color: "var(--purple)" },
    { label: "Gists",       value: user.public_gists,  color: "var(--cyan)"   },
    { label: "Years active",value: accountYears,       color: "var(--text-2)" },
  ];

  const contacts = [
    { label: "Gmail",     href: "mailto:fernandohaeserr@gmail.com",        color: "#EA4335" },
    { label: "Discord",   href: "https://discord.gg/fefedaplay",           color: "#5865F2" },
    { label: "LinkedIn",  href: "https://www.linkedin.com/in/fehaeser/",   color: "#0A66C2" },
    { label: "Instagram", href: "https://www.instagram.com/devhaeser/",    color: "#E1306C" },
    { label: "GitHub",    href: `https://github.com/${user.login}`,        color: "var(--green)" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>

      {/* ── Nav ── */}
      <nav style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(8px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
          <span style={{ color: "var(--text-2)" }}>@{user.login}</span>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ color: "var(--text)", fontWeight: 500 }}>stats</span>
        </div>
        <a
          href="/api/svg"
          target="_blank"
          style={{ fontSize: "12px", color: "var(--blue)", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px", opacity: 0.85 }}
        >
          ↗ Embed SVG
        </a>
      </nav>

      {/* ── Content ── */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 20px 72px" }}>

        {/* ── Profile header ── */}
        <div className="profile-header fade-up" style={{ display: "flex", gap: "20px", marginBottom: "28px", alignItems: "flex-start" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.avatar_url + "&s=96"}
            alt={user.login}
            width={88}
            height={88}
            style={{ borderRadius: "50%", border: "2px solid var(--border)", flexShrink: 0 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "20px", fontWeight: 700 }}>{user.name ?? user.login}</h1>
              <span style={{ fontSize: "14px", color: "var(--text-2)" }}>@{user.login}</span>
              <span style={{
                fontSize: "11px",
                background: "rgba(163,113,247,0.12)",
                color: "var(--purple)",
                padding: "2px 8px",
                borderRadius: "12px",
                border: "1px solid rgba(163,113,247,0.3)",
                fontWeight: 500,
              }}>
                LV {lv}
              </span>
            </div>
            {user.bio && (
              <p style={{ fontSize: "14px", color: "var(--text-2)", marginBottom: "8px", lineHeight: 1.6 }}>
                {user.bio}
              </p>
            )}
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "var(--text-3)", marginBottom: "12px" }}>
              {user.location && <span>📍 {user.location}</span>}
              <span>📅 Joined {joinYear}</span>
              <span>👥 {user.followers} followers · {user.following} following</span>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {contacts.map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-chip"
                  style={{ color: c.color, border: `1px solid ${c.color}40`, background: `${c.color}0d` }}
                >
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Gradient divider */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, var(--blue), var(--purple), transparent)", marginBottom: "28px", opacity: 0.6 }} />

        {/* ── Stats ── */}
        <div
          className="stat-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px", marginBottom: "16px" }}
        >
          {statItems.map((s, i) => (
            <div
              key={s.label}
              className="card fade-up"
              style={{ padding: "16px 12px", textAlign: "center", animationDelay: `${i * 50}ms` }}
            >
              <div style={{ fontSize: "22px", fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "5px", letterSpacing: "0.03em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── XP bar ── */}
        <div className="card" style={{ padding: "14px 18px", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "11px" }}>
            <span style={{ color: "var(--text-3)", fontWeight: 600, letterSpacing: "0.06em" }}>XP PROGRESS</span>
            <span style={{ color: "var(--purple)" }}>{expPct} / 100</span>
          </div>
          <div style={{ height: "6px", background: "var(--border-subtle)", borderRadius: "3px", overflow: "hidden" }}>
            <div
              className="bar-fill"
              style={{
                height: "100%",
                background: "linear-gradient(90deg, var(--blue), var(--purple))",
                borderRadius: "3px",
                "--bar-width": `${expPct}%`,
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* ── Languages ── */}
        <div className="card" style={{ padding: "20px", marginBottom: "24px" }}>
          <p className="section-title">Top Languages</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {languages.map((l, i) => (
              <LangBar key={l.name} name={l.name} pct={l.pct} color={l.color} delay={i * 80} />
            ))}
          </div>
        </div>

        {/* ── Top Repos ── */}
        <div style={{ marginBottom: "24px" }}>
          <p className="section-title">Top Repositories</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(265px, 1fr))", gap: "10px" }}>
            {topRepos.map(r => <RepoCard key={r.name} repo={r} />)}
          </div>
        </div>

        {/* ── Activity ── */}
        <div className="card" style={{ padding: "20px", marginBottom: "24px" }}>
          <p className="section-title">Activity</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://streak-stats.demolab.com?user=FernandoHaeser&theme=dark&hide_border=true&background=161B22&stroke=30363d&ring=58a6ff&fire=f0883e&currStreakNum=e6edf3&sideNums=e6edf3&currStreakLabel=58a6ff&sideLabels=8b949e&dates=6e7681"
              alt="GitHub Streak"
              style={{ maxWidth: "100%", borderRadius: "6px" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://github-readme-activity-graph.vercel.app/graph?username=FernandoHaeser&theme=github-dark&hide_border=true&area=true&color=58a6ff&line=58a6ff&point=f0883e&area_color=58a6ff22"
              alt="Activity Graph"
              style={{ maxWidth: "100%", width: "100%", borderRadius: "6px" }}
            />
          </div>
        </div>

        {/* ── Achievements ── */}
        <div className="card" style={{ padding: "20px", marginBottom: "24px" }}>
          <p className="section-title">Achievements</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://github-profile-trophy.vercel.app/?username=FernandoHaeser&theme=onestar&no-frame=true&margin-w=8&margin-h=8&column=7&no-bg=true"
            alt="Trophies"
            style={{ maxWidth: "100%", width: "100%" }}
          />
        </div>

        {/* ── Profile Summary ── */}
        <div className="card" style={{ padding: "20px", marginBottom: "28px" }}>
          <p className="section-title">Profile Summary</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "10px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=FernandoHaeser&theme=github_dark" alt="Repos per Language" style={{ height: "110px", borderRadius: "4px" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://github-profile-summary-cards.vercel.app/api/cards/most-commit-language?username=FernandoHaeser&theme=github_dark" alt="Most Commit Language" style={{ height: "110px", borderRadius: "4px" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://github-profile-summary-cards.vercel.app/api/cards/stats?username=FernandoHaeser&theme=github_dark" alt="Stats" style={{ height: "110px", borderRadius: "4px" }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=FernandoHaeser&theme=github_dark&utcOffset=-3" alt="Productive Time" style={{ height: "110px", borderRadius: "4px" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://github-profile-summary-cards.vercel.app/api/cards/profile-details?username=FernandoHaeser&theme=github_dark" alt="Profile Details" style={{ maxWidth: "100%", borderRadius: "4px" }} />
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "20px", display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://komarev.com/ghpvc/?username=FernandoHaeser&style=flat-square&color=58a6ff&label=profile+views&labelColor=161b22"
            alt="Profile Views"
            style={{ height: "18px" }}
          />
          <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
            © {new Date().getFullYear()} FernandoHaeser
          </span>
        </div>

      </div>
    </main>
  );
}
