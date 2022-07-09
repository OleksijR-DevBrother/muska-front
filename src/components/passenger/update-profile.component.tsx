import styles from './css/styles.module.scss';

import { FunctionComponent, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreDispatch, useStoreSelector } from '../../redux/store';
import { updateUser } from '../../redux/slices/user.slice';
import { localization } from '../../localization';

export const UpdateProfile: FunctionComponent = () => {
  const user = useStoreSelector((state) => state.user);

  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [patronymic, setPatronymic] = useState(user.patronymic);
  const [DOB, setDOB] = useState(user.DOB);
  const [username, setUsername] = useState(user.username);
  const [error, setError] = useState('');

  const dispatch = useStoreDispatch();

  const updateUserFunction = async (e: any) => {
    e.preventDefault();

    let url = new URL(`/user/${user.id}`, config.authUrl).toString();
    let res = await axios.patch(
      url,
      {
        name,
        surname,
        patronymic,
        DOB,
        username,
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

    url = new URL('/user/verify', config.authUrl).toString();
    res = await axios.post(url, {
      accessToken: user.accessToken,
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

    dispatch(
      updateUser({
        id: res.data.id,
        name: res.data.name,
        surname: res.data.surname,
        patronymic: res.data.patronymic,
        DOB: res.data.DOB,
        username: res.data.username,
      }),
    );
  };

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form onSubmit={updateUserFunction}>
      <input
        type="text"
        placeholder={localization.name[user.language]}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder={localization.surname[user.language]}
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
      />
      <input
        type="text"
        placeholder={localization.patronimic[user.language]}
        value={patronymic}
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
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <button type="submit">{localization.updateProfile[user.language]}</button>

      {errorAlert}
    </form>
  );
};
