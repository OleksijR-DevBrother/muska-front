import styles from './css/styles.module.scss';

import { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { config } from '../../config';
import { useStoreDispatch, useStoreSelector } from '../../redux/store';
import { updateUser } from '../../redux/slices/user.slice';
import { localization } from '../../localization';

export const Login: FunctionComponent = () => {
  const user = useStoreSelector((state) => state.user);

  const [username, setusername] = useState('+380000000000');
  const [password, setPassword] = useState('adminadmin');
  const [error, setError] = useState('');

  const dispatch = useStoreDispatch();

  const loginFunction = async (e: any) => {
    e.preventDefault();

    let url = new URL('/user/login', config.authUrl).toString();
    let res = await axios.post(url, {
      username,
      password,
    });

    if (res.status > 300) {
      setError(res.data.message);
      return;
    }

    const userUpdate = {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      role: res.data.role,
    };

    url = new URL('/user/verify', config.authUrl).toString();
    res = await axios.post(url, {
      accessToken: res.data.accessToken,
    });

    if (res.status > 300) {
      setError(res.data.message);
      return;
    }

    Object.assign(userUpdate, {
      id: res.data.id,
      name: res.data.name,
      surname: res.data.surname,
      patronymic: res.data.patronymic,
      DOB: res.data.DOB,
      username: res.data.username,
    });

    dispatch(updateUser(userUpdate));
  };

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form className="form" onSubmit={loginFunction}>
      <input
        type="text"
        placeholder="Phone"
        defaultValue={username}
        onChange={(e) => setusername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        defaultValue={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">{localization.login[user.language]}</button>
      <br />
      <Link to={'/auth/signup'}>
        <button type="button">{localization.signUp[user.language]}</button>
      </Link>

      {errorAlert}
    </form>
  );
};
