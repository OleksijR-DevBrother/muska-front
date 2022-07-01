import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const UpdateRoute: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [routeId, setRouteId] = useState('');
  const [routeName, setRouteName] = useState('');
  const [error, setError] = useState('');

  const updateRouteFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      `/routes/update/${routeId}`,
      config.trainsUrl,
    ).toString();
    const res = await axios.patch(
      url,
      { name: routeName },
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

    loadData();
  };

  const [routes, setRoutes] = useState([] as any[]);

  if (routeId && routes.length && !routeName) {
    setRouteName(routes.find((route) => route.id === routeId).name);
  }

  const loadData = async () => {
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
      onSubmit={updateRouteFunction}
      style={{ fontSize: 15 }}
    >
      {localization.route[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => {
          setRouteName('');
          setRouteId(e.target.value);
        }}
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
        type="text"
        placeholder={localization.naming[user.language]}
        value={routeName}
        onChange={(e) => setRouteName(e.target.value)}
        required
      />

      <button type="submit">Update route</button>

      {errorAlert}
    </form>
  );
};
