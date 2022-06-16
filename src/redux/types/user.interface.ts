import { Language } from '../../localization';

export class User {
  accessToken?: string;
  refreshToken?: string;
  role?: string;
  language: Language = Language.ENGLISH;
}
