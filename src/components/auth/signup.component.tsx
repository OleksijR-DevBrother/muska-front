import styles from './css/styles.module.scss';

import { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { config } from '../../config';
import { localization } from '../../localization';
import { useStoreSelector } from '../../redux/store';

export const SignUp: FunctionComponent = () => {
  const user = useStoreSelector((state) => state.user);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [DOB, setDOB] = useState('');
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signUpFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL('/user/signup', config.authUrl).toString();
    const res = await axios.post(url, {
      name,
      surname,
      patronymic,
      DOB,
      username,
      password,
      isBlocked: false,
      role: 'passenger',
    });

    if (res.data.error) {
      setError(res.data.error);
      return;
    }
  };

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form onSubmit={signUpFunction}>
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Surname"
        onChange={(e) => setSurname(e.target.value)}
      />
      <input
        type="text"
        placeholder="Patronymic"
        onChange={(e) => setPatronymic(e.target.value)}
      />
      <input
        type="text"
        placeholder="Date of Birth"
        onChange={(e) => setDOB(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone"
        onChange={(e) => setusername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">{localization.signUp[user.language]}</button>
      <br />
      <Link to={'/auth/login'}>
        <button type="button" id="login-button">
          {localization.login[user.language]}
        </button>
      </Link>

      {errorAlert}
    </form>
  );
};
