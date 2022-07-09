import styles from './css/styles.module.scss';

import { FunctionComponent, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreDispatch, useStoreSelector } from '../../redux/store';
import { updateUser } from '../../redux/slices/user.slice';

export const UpdateProfile: FunctionComponent = () => {
  const user = useStoreSelector((state) => state.user);

  const [name, setName] = useState(user.name);
  const [surname, setSurname] = useState(user.surname);
  const [patronymic, setPatronymic] = useState(user.patronymic);
  const [DOB, setDOB] = useState(user.DOB);
  const [username, setusername] = useState(user.username);
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

    if (res.data.error) {
      setError(res.data.error);
      return;
    }

    url = new URL('/user/verify', config.authUrl).toString();
    res = await axios.post(url, {
      accessToken: user.accessToken,
    });

    if (res.status > 300) {
      setError(res.data.message);
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
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Surname"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
      />
      <input
        type="text"
        placeholder="Patronymic"
        value={patronymic}
        onChange={(e) => setPatronymic(e.target.value)}
      />
      <input
        type="text"
        placeholder="Date of Birth"
        value={DOB}
        onChange={(e) => setDOB(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone"
        value={username}
        onChange={(e) => setusername(e.target.value)}
        required
      />

      <button type="submit">Update profile</button>

      {errorAlert}
    </form>
  );
};
