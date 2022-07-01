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
  from: {
    english: 'From',
    ukrainian: 'Звідки',
  },
  to: {
    english: 'To',
    ukrainian: 'Куди',
  },
  welcome: {
    english: 'Welcome to TickTrip!',
    ukrainian: 'Вітаємо у TickTrip!',
  },
  addUser: {
    english: 'Add new user',
    ukrainian: 'Додати користувача',
  },
  logout: {
    english: 'Logout',
    ukrainian: 'Вийти',
  },
  delete: {
    english: 'Delete',
    ukrainian: 'Видалити',
  },
  block: {
    english: 'Block',
    ukrainian: 'Заблокувати',
  },
  unblock: {
    english: 'Unblock',
    ukrainian: 'Розблокувати',
  },
  addStationToRoute: {
    english: 'Add station to route',
    ukrainian: 'Додати станцію на маршрут',
  },
  createCarriage: {
    english: 'Add carriage',
    ukrainian: 'Додати вагон',
  },
  createRoute: {
    english: 'Create route',
    ukrainian: 'Створити маршрут',
  },
  createStation: {
    english: 'Create station',
    ukrainian: 'Створити станцію',
  },
  createTrainAtStation: {
    english: 'Create train at station',
    ukrainian: 'Додати потяг на станцію',
  },
  createTrainDepartureTime: {
    english: 'Create train departure time',
    ukrainian: 'Створити час відправки потяга',
  },
  createTrain: {
    english: 'Create train',
    ukrainian: 'Створити потяг',
  },
  route: {
    english: 'Ruote',
    ukrainian: 'Маршрут',
  },
  trainNumber: {
    english: 'Train number',
    ukrainian: 'Номер потяга',
  },
  departureTime: {
    english: 'Departure time',
    ukrainian: 'Час відправки',
  },
  travelTime: {
    english: 'Travel time',
    ukrainian: 'Час в дорозі',
  },
  freeSittings: {
    english: 'See free sittings',
    ukrainian: 'Подивитися вільні місця',
  },
  carriage: {
    english: 'Carriage',
    ukrainian: 'Вагон',
  },
  sitting: {
    english: 'Sitting',
    ukrainian: 'Сидіння',
  },
  buyTicket: {
    english: 'Buy ticket',
    ukrainian: 'Купити квиток',
  },
  name: {
    english: 'Name',
    ukrainian: 'Iм`я',
  },
  surname: {
    english: 'Surname',
    ukrainian: 'Прізвище',
  },
  patronimic: {
    english: 'Patronimic',
    ukrainian: 'По-батькові',
  },
  DOB: {
    english: 'Date of birth',
    ukrainian: 'Дата нарождення',
  },
  address: {
    english: 'Address',
    ukrainian: 'Адреса',
  },
  phone: {
    english: 'Phone',
    ukrainian: 'Номер телефона',
  },
  password: {
    english: 'Password',
    ukrainian: 'Пароль',
  },
  role: {
    english: 'Role',
    ukrainian: 'Роль',
  },
  listOfUsers: {
    english: 'List of users',
    ukrainian: 'Список коритувачів',
  },
  searchWaysBetweenStations: {
    english: 'Search ways between stations',
    ukrainian: 'Пошук маршрутів між станціями',
  },
  searchTrainsBetweenStations: {
    english: 'Search trains between stations',
    ukrainian: 'Пошук потягів між станціями',
  },
  search: {
    english: 'Search',
    ukrainian: 'Пошук',
  },
  day: {
    english: 'Day',
    ukrainian: 'День',
  },
  station: {
    english: 'Station',
    ukrainian: 'Станція',
  },
  train: {
    english: 'Train',
    ukrainian: 'Потяг',
  },
  type: {
    english: 'Type',
    ukrainian: 'Тип',
  },
  addCarriage: {
    english: 'Add carriage',
    ukrainian: 'Додати вагон',
  },
  naming: {
    english: 'Name',
    ukrainian: 'Назва',
  },
  direction: {
    english: 'Direction',
    ukrainian: 'Напрям',
  },
  hour: {
    english: 'Hour',
    ukrainian: 'Година',
  },
  minute: {
    english: 'Minute',
    ukrainian: 'Хвилина',
  },
  fromStart: {
    english: 'From start',
    ukrainian: 'З початку марштуру',
  },
  fromEnd: {
    english: 'From end',
    ukrainian: 'З кінця марштуру',
  },
  wayTimeInMinutes: {
    english: 'Way time in minutes',
    ukrainian: 'Час у русі у хвилинах',
  },
  fromFirstStation: {
    english: 'From first station',
    ukrainian: 'З першої станції',
  },
  fromLastStation: {
    english: 'From last station',
    ukrainian: 'З кінцевої станції',
  },
  trainStand: {
    english: 'Train stand',
    ukrainian: 'Зупинка',
  },
};
