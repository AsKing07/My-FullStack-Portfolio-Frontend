// Types pour GitHub
export interface GithubOwner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
  site_admin: boolean;
}

export interface GithubProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: GithubOwner;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  topics: string[];
  visibility: string;
  archived: boolean;
  disabled: boolean;
  license: any;
 
}


export interface GitHubLanguage {
  name: string;
  count: number;
  percentage: number;
}

export interface GitHubStats {
  profile: GithubProfile;
  stats: {
    totalStars: number;
    totalRepos: number;
    totalContributions?: number;
    totalForks?: number;
    languages: GitHubLanguage[];
    topRepos: GithubRepo[];
     totalCommitsThisYear?: number;
  };
}
