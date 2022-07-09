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
  const [indexInTrain, setIndexInTrain] = useState(1);
  const [numberOfSittings, setNumberOfSittings] = useState(1);
  const [ticketPrice, setTicketPrice] = useState(0.01);
  const [error, setError] = useState('');

  const changeToPositiveInt = (
    value: string,
    setFunction: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    let num = parseInt(value);
    if (num < 1) num = 1;
    setFunction(num);
  };

  const changeTicketPrice = (value: string) => {
    let price = Math.floor(Number(value) * 100 + 0.1) / 100;
    if (price < 0) price = 0;
    setTicketPrice(price);
  };

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
        {types.map((type) => (
          <option key={type.name} value={type.name}>
            {type.name}
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
        onChange={(e) => changeToPositiveInt(e.target.value, setIndexInTrain)}
        required
      />
      <br />
      Number of sittings
      <input
        type="number"
        placeholder="Number of sittings"
        value={numberOfSittings}
        onChange={(e) =>
          changeToPositiveInt(e.target.value, setNumberOfSittings)
        }
        required
      />
      <br />
      Ticket price
      <input
        type="number"
        placeholder="Ticket price"
        min={0}
        step={0.01}
        value={ticketPrice}
        onChange={(e) => changeTicketPrice(e.target.value)}
        required
      />
      <br />
      <button type="submit">{localization.addCarriage[user.language]}</button>
      {errorAlert}
    </form>
  );
};
