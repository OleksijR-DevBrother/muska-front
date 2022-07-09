import styles from './css/styles.module.scss';

import { FunctionComponent, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const AddUser: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [DOB, setDOB] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const addUserFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL('/user/add', config.authUrl).toString();
    const res = await axios.post(
      url,
      {
        name,
        surname,
        patronymic,
        DOB,
        username,
        role,
        isBlocked: false,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );

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
  };

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form onSubmit={addUserFunction}>
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
      <a style={{ fontSize: 15 }}>Role:</a>
      <select
        style={{ color: 'black', fontSize: 15 }}
        onChange={(e) => setRole(e.target.value)}
        value={role}
      >
        <option value="passenger" style={{ color: 'black' }}>
          Passenger
        </option>
        <option value="manager" style={{ color: 'black' }}>
          Manager
        </option>
        <option value="Admin" style={{ color: 'black' }}>
          Admin
        </option>
      </select>
      <br />
      <br />

      <button type="submit">{localization.addUser[user.language]}</button>

      {errorAlert}
    </form>
  );
};
