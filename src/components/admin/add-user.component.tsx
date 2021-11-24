import styles from './css/styles.module.scss';

import { FunctionComponent, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';

export const AddUser: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [DOB, setDOB] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
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
        address,
        phoneNumber,
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

    if (res.data.error) {
      setError(res.data.error);
      return;
    }
  };

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form onSubmit={addUserFunction}>
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
        placeholder="Address"
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone"
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Role"
        onChange={(e) => setRole(e.target.value)}
        required
      />

      <button type="submit">Add User</button>

      {errorAlert}
    </form>
  );
};
