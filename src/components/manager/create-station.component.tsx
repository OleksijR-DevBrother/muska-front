import styles from './css/styles.module.scss';

import { FunctionComponent, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const CreateStation: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const createStationFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL('/stations/create', config.trainsUrl).toString();
    const res = await axios.post(
      url,
      { name },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );

    if (res.status > 300) {
      setError(res.data.message);
      return;
    }

    setName('');
    setError('');
  };

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form className="form" onSubmit={createStationFunction}>
      <input
        type="text"
        placeholder={localization.naming[user.language]}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <button type="submit">{localization.createStation[user.language]}</button>

      {errorAlert}
    </form>
  );
};
