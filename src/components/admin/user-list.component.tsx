import { FunctionComponent, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';

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

  if (!users.length) {
    loadUsersList();
  }

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
      <h2 style={{ marginBottom: '20px' }}>List of users</h2>
      {users.map((user) => (
        <div style={{ margin: '10px' }} key={user.id}>
          <h3 style={{ display: 'inline' }}>
            {user.name} {user.surname}
          </h3>

          <button
            style={{ backgroundColor: 'red' }}
            onClick={() => deleteUser(user.id)}
          >
            Delete
          </button>

          {user.isBlocked ? (
            <button
              style={{ backgroundColor: 'purple' }}
              onClick={() => unblockUser(user.id)}
            >
              Unblock
            </button>
          ) : (
            <button
              style={{ backgroundColor: 'purple' }}
              onClick={() => blockUser(user.id)}
            >
              Block
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
