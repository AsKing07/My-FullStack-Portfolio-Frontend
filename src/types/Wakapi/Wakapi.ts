// Types pour Wakapi (instance auto-hébergée compatible WakaTime)
export interface WakapiLanguage {
  name: string;
  total_seconds: number;
  percent: number;
  text: string;
}

export interface WakapiEditor {
  name: string;
  total_seconds: number;
  percent: number;
  text: string;
}

export interface WakapiStats {
  username: string;
  range: string;
  human_readable_range: string;
  total_seconds: number;
  human_readable_total: string;
  daily_average: number;
  human_readable_daily_average: string;
  languages: WakapiLanguage[];
  editors: WakapiEditor[];
}

export interface WakapiDailySummary {
  date: string;
  total_seconds: number;
}
