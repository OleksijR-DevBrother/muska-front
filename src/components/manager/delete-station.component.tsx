import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const DeleteStation: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [stationId, setStationId] = useState('');
  const [error, setError] = useState('');

  const deleteStationFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      `/stations/delete/${stationId}`,
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

  const [stations, setStations] = useState([] as any[]);

  const loadData = async () => {
    const { data: stations } = await axios.get(
      new URL('/stations/get/list', config.trainsUrl).toString(),
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    setStations(stations);

    if (stations.length) {
      setStationId(stations[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form
      className="form"
      onSubmit={deleteStationFunction}
      style={{ fontSize: 15 }}
    >
      {localization.station[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => setStationId(e.target.value)}
        value={stationId}
      >
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>

      <button type="submit">{localization.deleteStation[user.language]}</button>

      {errorAlert}
    </form>
  );
};
