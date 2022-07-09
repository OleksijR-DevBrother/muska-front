import styles from './css/styles.module.scss';

import { FunctionComponent, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const CreateCarriageType: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const createCarriageFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL('/carriages/types/create', config.trainsUrl).toString();
    const res = await axios.post(
      url,
      {
        name,
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

    setError('');
  };

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form
      className="form"
      onSubmit={createCarriageFunction}
      style={{ fontSize: 15 }}
    >
      <input
        type="text"
        placeholder={localization.naming[user.language]}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <button type="submit">
        {localization.createCarriageType[user.language]}
      </button>

      {errorAlert}
    </form>
  );
};
