import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const AddStationToRoute: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [stationId, setStationId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [stationIndex, setStationIndex] = useState(1);
  const [error, setError] = useState('');

  const createTrainFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      '/routes/stations-on-route/create',
      config.trainsUrl,
    ).toString();
    const res = await axios.post(
      url,
      { stationId, routeId, stationIndexOnTheRoute: stationIndex - 1 },
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

    setError('');
  };

  const [stations, setStations] = useState([] as any[]);
  const [routes, setRoutes] = useState([] as any[]);

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

    const { data: routes } = await axios.get(
      new URL('/routes/get/list', config.trainsUrl).toString(),
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    setRoutes(routes);

    if (routes.length) {
      setRouteId(routes[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form
      className="form"
      onSubmit={createTrainFunction}
      style={{ fontSize: 15 }}
    >
      {localization.station[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => setStationId(e.target.value)}
        value={stationId}
      >
        {stations.map((station) => (
          <option
            key={station.id}
            value={station.id}
            style={{ color: 'black' }}
          >
            {station.name}
          </option>
        ))}
      </select>
      <br />
      <br />
      {localization.route[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => setRouteId(e.target.value)}
        value={routeId}
      >
        {routes.map((route) => (
          <option key={route.id} value={route.id}>
            {route.name}
          </option>
        ))}
      </select>
      <br />
      <br />
      <input
        type="number"
        placeholder="Index on the route"
        value={stationIndex}
        onChange={(e) => setStationIndex(Number(e.target.value))}
        required
      />
      <button type="submit">
        {localization.addStationToRoute[user.language]}
      </button>
      {errorAlert}
    </form>
  );
};
