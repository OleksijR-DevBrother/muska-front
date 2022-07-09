import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const UpdateStation: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [stationId, setStationId] = useState('');
  const [stationName, setStationName] = useState('');
  const [error, setError] = useState('');

  const updateStationFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      `/stations/update/${stationId}`,
      config.trainsUrl,
    ).toString();
    const res = await axios.patch(
      url,
      { name: stationName },
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

    loadData();
  };

  const [stations, setStations] = useState([] as any[]);

  if (stationId && stations.length && !stationName) {
    setStationName(stations.find((station) => station.id === stationId).name);
  }

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
      onSubmit={updateStationFunction}
      style={{ fontSize: 15 }}
    >
      {localization.station[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => {
          setStationName('');
          setStationId(e.target.value);
        }}
        value={stationId}
      >
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>

      <br />
      <br />
      <input
        type="text"
        placeholder={localization.naming[user.language]}
        value={stationName}
        onChange={(e) => setStationName(e.target.value)}
        required
      />

      <button type="submit">{localization.updateStation[user.language]}</button>

      {errorAlert}
    </form>
  );
};
