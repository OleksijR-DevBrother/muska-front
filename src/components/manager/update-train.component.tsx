import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const UpdateTrain: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [trainId, setTrainId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [trainName, setTrainName] = useState('');
  const [trainType, setTrainType] = useState('');
  const [error, setError] = useState('');

  const changeTrain = (e: any) => {
    e.preventDefault();

    const train = trains.find((train) => train.id === e.target.value);

    setTrainName(train.name);
    setTrainType(train.typeName);
    setRouteId(train.routeId);
    setTrainId(e.target.value);
  };

  const updateTrainFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      `/trains/update/${trainId}`,
      config.trainsUrl,
    ).toString();
    const res = await axios.patch(
      url,
      {
        name: trainName,
        typeName: trainType,
        routeId,
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

    loadData();
  };

  const [trains, setTrains] = useState([] as any[]);
  const [trainTypes, setTrainTypes] = useState([] as any[]);
  const [routes, setRoutes] = useState([] as any[]);

  if (trainId && trains.length && !trainName) {
    setTrainName(trains.find((train) => train.id === trainId).name);
  }

  const loadData = async () => {
    const { data: trains } = await axios.get(
      new URL('/trains/get/list', config.trainsUrl).toString(),
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    setTrains(trains);

    if (trains.length) {
      setTrainId(trains[0].id);
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

    const { data: trainTypes } = await axios.get(
      new URL('/trains/types/get/list', config.trainsUrl).toString(),
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    setTrainTypes(trainTypes);

    if (trainTypes.length) {
      setTrainType(trainTypes[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form
      className="form"
      onSubmit={updateTrainFunction}
      style={{ fontSize: 15 }}
    >
      {localization.train[user.language]}
      <select style={{ color: 'black' }} onChange={changeTrain} value={trainId}>
        {trains.map((train) => (
          <option key={train.id} value={train.id}>
            {train.name}
          </option>
        ))}
      </select>
      <br />
      <br />

      <input
        type="text"
        placeholder={localization.naming[user.language]}
        value={trainName}
        onChange={(e) => setTrainName(e.target.value)}
        required
      />

      {localization.type[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => setTrainType(e.target.value)}
        value={trainType}
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

      <button type="submit">{localization.updateTrain[user.language]}</button>

      {errorAlert}
    </form>
  );
};
