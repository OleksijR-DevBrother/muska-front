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
  const [carriageId, setCarriageId] = useState('');
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

    setCarriages(res.data);
    if (res.data.length) setCarriageId(res.data[0].id);
  };

  useEffect(() => {
    loadCarriages();
  }, [trainId]);

  const deleteCarriageFunction = async (e: any) => {
    e.preventDefault();

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

      {carriages.length ? (
        <>
          Index in train
          <select
            style={{ color: 'black' }}
            onChange={(e) => setCarriageId(e.target.value)}
            value={carriageId}
          >
            {carriages.map((carriage) => (
              <option key={carriage.id} value={carriage.id}>
                {carriage.indexInTrain}
              </option>
            ))}
          </select>
          <br />
          <br />
          <button type="submit">Delete carriage</button>
        </>
      ) : (
        <h2>This train doesn't have carriages</h2>
      )}

      {errorAlert}
    </form>
  );
};
