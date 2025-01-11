interface GlobalConfig {
  localSyncTime: number;
  configs: Config[];
}

type TranslateService = "google" | "bing";

interface Config {
  match: string | string[];
  enable: boolean;
}
