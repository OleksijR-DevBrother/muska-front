import { FunctionComponent, useEffect, useState } from 'react';
import styles from './css/styles.module.scss';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';
import { ArrowLeft } from '@material-ui/icons';

export const UsersList: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [users, setUsers] = useState([] as any[]);
  const [username, setUsername] = useState('');

  const loadUsersList = async () => {
    const url = new URL('/user/userlist', config.authUrl).toString();
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    setUsers(res.data);
  };

  useEffect(() => {
    loadUsersList();
  }, []);

  const findUser = async (username: string) => {
    const url = new URL(
      `/user/username/${username}`,
      config.authUrl,
    ).toString();
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    setUsers([res.data]);
  };

  const deleteUser = async (userId: string) => {
    const url = new URL(`/user/${userId}`, config.authUrl).toString();
    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    await loadUsersList();
  };

  const blockUser = async (userId: string) => {
    const url = new URL(`/user/block/${userId}`, config.authUrl).toString();
    await axios.patch(
      url,
      {
        block: true,
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );

    await loadUsersList();
  };

  const unblockUser = async (userId: string) => {
    const url = new URL(`/user/block/${userId}`, config.authUrl).toString();
    await axios.patch(
      url,
      {
        block: false,
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );

    await loadUsersList();
  };

  return (
    <div>
      <label htmlFor="findUser" className={styles['labelSearch']}>
        {localization.labelPlease[user.language]}
      </label>
      <input
        className={styles['inputUser']}
        type="text"
        id="findUser"
        placeholder="Username"
        defaultValue={'Username'}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <button
        type="submit"
        className={styles['searchButton']}
        onClick={() => findUser(username)}
      >
        {localization.searchButton[user.language]}
      </button>
      {/* <h2 style={{ marginBottom: '20px' }}>List of users</h2> */}
      {users.map((user1) => (
        <div style={{ margin: '10px' }} key={user1.id}>
          <h3 style={{ display: 'block' }}>
            {user1.name} {user1.surname}
          </h3>

          <button
            className={styles['deleteButton']}
            onClick={() => deleteUser(user1.id)}
          >
            {localization.delete[user.language]}
          </button>

          {user1.isBlocked ? (
            <button
              className={styles['unblockButton']}
              onClick={() => unblockUser(user1.id)}
            >
              {localization.unblock[user.language]}
            </button>
          ) : (
            <button
              className={styles['blockButton']}
              onClick={() => blockUser(user1.id)}
            >
              {localization.block[user.language]}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
