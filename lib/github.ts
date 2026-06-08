const USERNAME = "FernandoHaeser";
const BASE = "https://api.github.com";
const REVALIDATE = 21600; // 6 hours

function authHeaders(): Record<string, string> {
  return {
    Accept: "application/vnd.github.v3+json",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  };
}

export interface GHUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  location: string | null;
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
  created_at: string;
}

export interface GHRepo {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  updated_at: string;
  topics: string[];
}

export interface Stats {
  user: GHUser;
  repos: GHRepo[];
  totalStars: number;
  totalForks: number;
  languages: { name: string; count: number; pct: number; color: string }[];
  topRepos: GHRepo[];
  level: number;
  expPct: number;
  accountYears: number;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Vue: "#41b883",
  Dart: "#00B4AB",
  Lua: "#000080",
  Scala: "#c22d40",
};

export async function getStats(): Promise<Stats> {
  const [userRes, reposRes] = await Promise.all([
    fetch(`${BASE}/users/${USERNAME}`, {
      headers: authHeaders(),
      next: { revalidate: REVALIDATE },
    }),
    fetch(`${BASE}/users/${USERNAME}/repos?per_page=100&sort=stars`, {
      headers: authHeaders(),
      next: { revalidate: REVALIDATE },
    }),
  ]);

  const user: GHUser = await userRes.json();
  const repos: GHRepo[] = await reposRes.json();

  const ownRepos = repos.filter((r) => !r.fork);

  const totalStars = ownRepos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = ownRepos.reduce((s, r) => s + r.forks_count, 0);

  const langMap: Record<string, number> = {};
  ownRepos.forEach((r) => {
    if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
  });
  const langTotal = Object.values(langMap).reduce((a, b) => a + b, 0) || 1;
  const languages = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / langTotal) * 100),
      color: LANG_COLORS[name] ?? "#8b949e",
    }));

  const topRepos = [...ownRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  const accountYears =
    new Date().getFullYear() - new Date(user.created_at).getFullYear();

  // RPG level: based on stars + repos + followers, capped at 99
  const rawLevel = Math.min(
    99,
    Math.floor((totalStars * 2 + user.public_repos + user.followers) / 5) + 1
  );
  const level = rawLevel;
  const expPct = ((totalStars + user.followers) % 100);

  return {
    user,
    repos,
    totalStars,
    totalForks,
    languages,
    topRepos,
    level,
    expPct,
    accountYears,
  };
}
