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

  const changeStationindex = (index: string) => {
    setStationIndex(parseInt(index));
  };

  const createRouteStationFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL('/routes/stations/create', config.trainsUrl).toString();
    const res = await axios.post(
      url,
      {
        stationId,
        routeId,
        stationIndexOnTheRoute: stationIndex - 1,
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
      onSubmit={createRouteStationFunction}
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
      Index
      <input
        type="number"
        placeholder="Index on the route"
        min={1}
        value={stationIndex}
        onChange={(e) => changeStationindex(e.target.value)}
        required
      />
      <button type="submit">
        {localization.addStationToRoute[user.language]}
      </button>
      {errorAlert}
    </form>
  );
};
