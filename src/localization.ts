export enum Language {
  ENGLISH = 'english',
  UKRAINIAN = 'ukrainian',
}

export class Localization {
  [phraseId: string]: {
    english: string;
    ukrainian: string;
  };
}

export const localization: Localization = {
  login: {
    english: 'Login',
    ukrainian: 'Увійти',
  },
  signUp: {
    english: 'Sign Up',
    ukrainian: 'Зареєструватися',
  },
};
