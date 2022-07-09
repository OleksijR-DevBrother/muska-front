import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const DeleteTrainDeparture: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

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

  const msToDateTimeString = (ms: number) => {
    const day = days[Math.floor(ms / (24 * 60 * 60_000))];

    let hour = String(Math.floor(ms / (60 * 60_000)) % 24);
    if (hour.length === 1) hour = '0' + hour;

    let minute = String(Math.floor(ms / 60_000) % 60);
    if (minute.length === 1) minute = '0' + minute;

    return `${day}, ${hour}:${minute}`;
  };

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
            {msToDateTimeString(departure.time)} | {departure.direction}
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
