import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const DeleteTrainDeparture: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [departureId, setDepartureId] = useState('');
  const [departures, setDepartures] = useState([] as any[]);
  const [trainId, setTrainId] = useState('');
  const [error, setError] = useState('');

  const loadDepartures = async () => {
    const url = new URL(
      `/trains/get/schedule/${trainId}`,
      config.trainsUrl,
    ).toString();
    const res = await axios.get(url, {
      params: {
        trainId,
      },
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    if (res.status > 300) {
      setError(res.data.message);
      return;
    }

    setError('');

    setDepartures(res.data);
  };

  useEffect(() => {
    if (trainId) {
      loadDepartures();
    }
  }, [trainId]);

  const deleteDepartureFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      `/departures/delete/${departureId}`,
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

  const [trains, setTrains] = useState([] as any[]);

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
  };

  useEffect(() => {
    loadData();
  }, []);

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form
      className="form"
      onSubmit={deleteDepartureFunction}
      style={{ fontSize: 15 }}
    >
      {localization.train[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => setTrainId(e.target.value)}
        value={trainId}
      >
        {trains.map((train) => (
          <option key={train.id} value={train.id}>
            {train.name}
          </option>
        ))}
      </select>
      <br />
      <br />
      Departure time
      <select
        style={{ color: 'black' }}
        onChange={(e) => setDepartureId(e.target.value)}
        value={departureId}
      >
        {departures.map((departure) => (
          <option key={departure.id} value={departure.id}>
            {departure.time} {departure.direction}
          </option>
        ))}
      </select>
      <br />
      <br />
      <button type="submit">
        {localization.deleteTrainDeparture[user.language]}
      </button>
      {errorAlert}
    </form>
  );
};
