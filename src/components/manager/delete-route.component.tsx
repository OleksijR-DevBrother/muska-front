import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const DeleteRoute: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [routeId, setRouteId] = useState('');
  const [error, setError] = useState('');

  const deleteRouteFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      `/routes/delete/${routeId}`,
      config.trainsUrl,
    ).toString();
    const res = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

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

  const [routes, setRoutes] = useState([] as any[]);

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
      onSubmit={deleteRouteFunction}
      style={{ fontSize: 15 }}
    >
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

      <button type="submit">{localization.deleteRoute[user.language]}</button>

      {errorAlert}
    </form>
  );
};
