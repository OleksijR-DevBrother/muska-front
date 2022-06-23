import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const UsersList: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [users, setUsers] = useState([] as any[]);

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
      {/* <h2 style={{ marginBottom: '20px' }}>List of users</h2> */}
      {users.map((user1) => (
        <div style={{ margin: '10px' }} key={user1.id}>
          <h3 style={{ display: 'inline' }}>
            {user1.name} {user1.surname}
          </h3>

          <button
            style={{ backgroundColor: 'red' }}
            onClick={() => deleteUser(user1.id)}
          >
            {localization.delete[user.language]}
          </button>

          {user1.isBlocked ? (
            <button
              style={{ backgroundColor: 'purple' }}
              onClick={() => unblockUser(user1.id)}
            >
              {localization.unblock[user.language]}
            </button>
          ) : (
            <button
              style={{ backgroundColor: 'purple' }}
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
