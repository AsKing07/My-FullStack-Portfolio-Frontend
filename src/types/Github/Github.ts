// Types pour GitHub
export interface GitHubProfile {
  login: string;
  name: string;
  avatarUrl: string;
  htmlUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
}

export interface GitHubLanguage {
  name: string;
  count: number;
  percentage: number;
}

export interface GitHubStats {
  profile: GitHubProfile;
  stats: {
    totalStars: number;
    totalRepos: number;
    languages: GitHubLanguage[];
    topRepos: GitHubRepo[];
  };
}
