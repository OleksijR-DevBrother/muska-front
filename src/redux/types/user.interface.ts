import { Language } from '../../localization';

export class User {
  accessToken?: string;
  refreshToken?: string;
  role?: string;
  language: Language = Language.ENGLISH;
  id?: string;
  name?: string;
  surname?: string;
  patronymic?: string;
  DOB?: string;
  username?: string;
}
