import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const CreateTrain: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [routeId, setRouteId] = useState('');
  const [error, setError] = useState('');

  const createTrainFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL('/trains/create', config.trainsUrl).toString();
    const res = await axios.post(
      url,
      {
        typeName: type,
        routeId,
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

  const [trainTypes, setTrainTypes] = useState([] as any[]);
  const [routes, setRoutes] = useState([] as any[]);

  const loadData = async () => {
    const { data: types } = await axios.get(
      new URL('/trains/types/get/list', config.trainsUrl).toString(),
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    setTrainTypes(types);

    if (types.length) {
      setType(types[0].name);
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
      {localization.type[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => setType(e.target.value)}
        value={type}
      >
        {trainTypes.map((trainType) => (
          <option key={trainType.name} value={trainType.name}>
            {trainType.name}
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
        type="text"
        placeholder={localization.naming[user.language]}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <button type="submit">{localization.createTrain[user.language]}</button>

      {errorAlert}
    </form>
  );
};
