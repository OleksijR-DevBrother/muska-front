import { config as defaultConfig } from './default.config';
import { config as localConfig } from './local.config';

export const config =
  process.env.NODE_ENV === 'production' ? defaultConfig : localConfig;
