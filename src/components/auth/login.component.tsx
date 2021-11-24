import styles from './css/styles.module.scss';

import { FunctionComponent, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { config } from '../../config';
import { useStoreDispatch } from '../../redux/store';
import { updateUser } from '../../redux/slices/user.slice';

export const Login: FunctionComponent = () => {
  const [phoneNumber, setPhoneNumber] = useState('+380000000000');
  const [password, setPassword] = useState('adminadmin');
  const [error, setError] = useState('');

  const dispatch = useStoreDispatch();

  const loginFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL('/user/login', config.authUrl).toString();
    const res = await axios.post(url, {
      phoneNumber,
      password,
    });

    if (res.status > 300) {
      setError(res.data.message);
      return;
    }

    dispatch(
      updateUser({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      }),
    );
  };

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form className="form" onSubmit={loginFunction}>
      <input
        type="text"
        placeholder="Phone"
        defaultValue={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        defaultValue={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>
      <br />
      <Link to={'/auth/signup'}>
        <button type="button">Sign Up</button>
      </Link>

      {errorAlert}
    </form>
  );
};
