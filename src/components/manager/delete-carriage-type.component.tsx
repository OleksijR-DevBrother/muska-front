import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const DeleteCarriageType: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [typeName, setTypeName] = useState('');
  const [error, setError] = useState('');

  const deleteCarriageFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      `/carriages/types/delete/${typeName}`,
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
    const { data: carriages } = await axios.get(
      new URL('/carriages/types/get/list', config.trainsUrl).toString(),
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    setTypes(carriages);

    if (carriages.length) {
      setTypeName(carriages[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form
      className="form"
      onSubmit={deleteCarriageFunction}
      style={{ fontSize: 15 }}
    >
      {localization.carriageType[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => setTypeName(e.target.value)}
        value={typeName}
      >
        {types.map((carriage) => (
          <option key={carriage.id} value={carriage.id}>
            {carriage.name}
          </option>
        ))}
      </select>
      <br />
      <br />

      <button type="submit">Delete carriage type</button>

      {errorAlert}
    </form>
  );
};
