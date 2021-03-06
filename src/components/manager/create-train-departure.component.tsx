import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const CreateTrainDeparture: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const days = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  const [trainId, setTrainId] = useState('');
  const [direction, setDirection] = useState('fromStart');
  const [day, setDay] = useState('Monday');
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [error, setError] = useState('');

  const changeHour = (value: string) => {
    let hour = parseInt(value);
    if (hour < 0) hour = 0;
    if (hour > 23) hour = 23;
    setHour(hour);
  };

  const changeMinute = (value: string) => {
    let minute = parseInt(value);
    if (minute < 0) minute = 0;
    if (minute > 59) minute = 59;
    setMinute(minute);
  };

  const createTrainFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      '/trains/departure-date/create',
      config.trainsUrl,
    ).toString();
    const res = await axios.post(
      url,
      {
        time: ((days as any)[day] * 24 * 60 + hour * 60 + minute) * 60 * 1000,
        trainId,
        direction,
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
      onSubmit={createTrainFunction}
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

      {localization.day[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => setDay(e.target.value)}
        value={day}
      >
        {Object.keys(days).map((dayname) => (
          <option key={dayname} value={dayname}>
            {dayname}
          </option>
        ))}
      </select>
      <br />
      <br />

      {localization.direction[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => setDirection(e.target.value)}
        value={direction}
      >
        <option key="fromStart" value="fromStart">
          {localization.fromStart[user.language]}
        </option>
        <option key="fromEnd" value="fromEnd">
          {localization.fromEnd[user.language]}
        </option>
      </select>
      <br />
      <br />

      {localization.hour[user.language]}
      <input
        type="number"
        placeholder="Hour"
        value={hour}
        onChange={(e) => changeHour(e.target.value)}
        required
      />
      <br />

      {localization.minute[user.language]}
      <input
        type="number"
        placeholder="Minute"
        value={minute}
        onChange={(e) => changeMinute(e.target.value)}
        required
      />

      <button type="submit">
        {localization.createTrainDepartureTime[user.language]}
      </button>

      {errorAlert}
    </form>
  );
};
