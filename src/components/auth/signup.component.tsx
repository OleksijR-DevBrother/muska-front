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
  const [DOB, setDOB] = useState('2007-01-01');
  const [username, setUsername] = useState('');
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

    if (res.status > 300) {
      let error = res.data.error;
      if (res.data.message) {
        if (Array.isArray(res.data.message)) {
          if (res.data.message.length) {
            error = res.data.message[0];
          }
        } else {
          error = res.data.message;
        }
      }
      setError(error);
      return;
    }

    window.location.pathname = '';
  };

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form onSubmit={signUpFunction}>
      <input
        type="text"
        placeholder={localization.name[user.language]}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder={localization.surname[user.language]}
        onChange={(e) => setSurname(e.target.value)}
      />
      <input
        type="text"
        placeholder={localization.patronimic[user.language]}
        onChange={(e) => setPatronymic(e.target.value)}
      />
      <input
        type="date"
        placeholder={localization.DOB[user.language]}
        value={DOB}
        onChange={(e) => setDOB(e.target.value)}
      />
      <input
        type="text"
        placeholder={localization.phone[user.language]}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder={localization.password[user.language]}
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
