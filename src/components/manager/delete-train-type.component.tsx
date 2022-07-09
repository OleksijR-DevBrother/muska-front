import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const DeleteTrainType: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [typeName, setTypeName] = useState('');
  const [error, setError] = useState('');

  const deleteTrainFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      `/trains/types/delete/${typeName}`,
      config.trainsUrl,
    ).toString();
    const res = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    if (res.status > 300) {
      setError(res.data.message);
      return;
    }

    setError('');
  };

  const [types, setTypes] = useState([] as any[]);

  const loadData = async () => {
    const { data: trains } = await axios.get(
      new URL('/trains/types/get/list', config.trainsUrl).toString(),
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    setTypes(trains);

    if (trains.length) {
      setTypeName(trains[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form
      className="form"
      onSubmit={deleteTrainFunction}
      style={{ fontSize: 15 }}
    >
      {localization.trainType[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => setTypeName(e.target.value)}
        value={typeName}
      >
        {types.map((train) => (
          <option key={train.id} value={train.id}>
            {train.name}
          </option>
        ))}
      </select>
      <br />
      <br />

      <button type="submit">Delete train type</button>

      {errorAlert}
    </form>
  );
};
