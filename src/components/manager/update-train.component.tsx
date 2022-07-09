import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const UpdateTrain: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [trainId, setTrainId] = useState('');
  const [trainName, setTrainName] = useState('');
  const [error, setError] = useState('');

  const updateTrainFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      `/trains/update/${trainId}`,
      config.trainsUrl,
    ).toString();
    const res = await axios.patch(
      url,
      { name: trainName },
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

  const [trains, setTrains] = useState([] as any[]);

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
      <select
        style={{ color: 'black' }}
        onChange={(e) => {
          setTrainName('');
          setTrainId(e.target.value);
        }}
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
      <input
        type="text"
        placeholder={localization.naming[user.language]}
        value={trainName}
        onChange={(e) => setTrainName(e.target.value)}
        required
      />

      <button type="submit">{localization.updateTrain[user.language]}</button>

      {errorAlert}
    </form>
  );
};
