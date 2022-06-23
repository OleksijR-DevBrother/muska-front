import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';
import { localization } from '../../localization';

export const CreateCarriage: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [trainId, setTrainId] = useState('');
  const [typeName, setTypeName] = useState('');
  const [indexInTrain, setIndexInTrain] = useState(0);
  const [numberOfSittings, setNumberOfSittings] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [error, setError] = useState('');

  const createTrainFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL('/carriages/create', config.trainsUrl).toString();
    const res = await axios.post(
      url,
      {
        indexInTrain,
        typeName,
        sittings: numberOfSittings,
        priceOfSitting: ticketPrice,
        trainId,
      },
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
  };

  const [trains, setTrains] = useState([] as any[]);
  const [types, setTypes] = useState([] as any[]);

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

    const { data: types } = await axios.get(
      new URL('/carriages/types/get/list', config.trainsUrl).toString(),
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    setTypes(types);

    if (types.length) {
      setTypeName(types[0].name);
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
      {localization.type[user.language]}
      <select
        style={{ color: 'black' }}
        onChange={(e) => setTypeName(e.target.value)}
        value={typeName}
      >
        {types.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
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
      Number of sittings
      <input
        type="number"
        placeholder="Number of sittings"
        value={numberOfSittings}
        onChange={(e) => setNumberOfSittings(Number(e.target.value))}
        required
      />
      <br />
      Ticket price
      <input
        type="number"
        placeholder="Ticket price"
        value={ticketPrice}
        onChange={(e) => setTicketPrice(Number(e.target.value))}
        required
      />
      <br />
      <button type="submit">{localization.addCarriage[user.language]}</button>
      {errorAlert}
    </form>
  );
};
