import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const DeleteCarriage: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [carriages, setCarriages] = useState([] as any[]);
  const [trainId, setTrainId] = useState('');
  const [indexInTrain, setIndexInTrain] = useState(0);
  const [error, setError] = useState('');

  const loadCarriages = async () => {
    const url = new URL('/carriages/get/list', config.trainsUrl).toString();
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

    setCarriages(res.data);
  };

  useEffect(() => {
    if (trainId) {
      loadCarriages();
    }
  }, [trainId]);

  const deleteCarriageFunction = async (e: any) => {
    e.preventDefault();

    const carriageId = carriages.find(
      (carriage) => (carriage.indexInTrain = indexInTrain),
    )?.id;
    if (!carriageId) {
      setError("Train doesn't have carriage with this index");
      return;
    }

    const url = new URL(
      `/carriages/delete/${carriageId}`,
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
      onSubmit={deleteCarriageFunction}
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
      Index in train
      <input
        type="number"
        placeholder="Index in train"
        value={indexInTrain}
        onChange={(e) => setIndexInTrain(Number(e.target.value))}
        required
      />
      <br />
      <button type="submit">Delete carriage</button>
      {errorAlert}
    </form>
  );
};
