import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';

export const CreateTrainAtStation: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [trainId, setTrainId] = useState('');
  const [stationId, setStationId] = useState('');
  const [wayFromFirstStation, setWayFromFirstStation] = useState(0);
  const [wayFromLastStation, setWayFromLastStation] = useState(0);
  const [trainStandFromFirstStation, setTrainStandFromFirstStation] =
    useState(0);
  const [trainStandFromLastStation, setTrainStandFromLastStation] = useState(0);
  const [error, setError] = useState('');

  const createTrainFunction = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      '/trains/at-station/create',
      config.trainsUrl,
    ).toString();
    const res = await axios.post(
      url,
      {
        trainId,
        stationId,
        wayFromFirstStation: wayFromFirstStation * 1000,
        wayFromLastStation: wayFromLastStation * 1000,
        trainStandFromFirstStation: trainStandFromFirstStation * 1000,
        trainStandFromLastStation: trainStandFromLastStation * 1000,
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
  const [stations, setStations] = useState([] as any[]);

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

    const { data: stations } = await axios.get(
      new URL('/stations/get/list', config.trainsUrl).toString(),
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    setStations(stations);

    if (stations.length) {
      setStationId(stations[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form className="form" onSubmit={createTrainFunction}>
      Train
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
      Station
      <select
        style={{ color: 'black' }}
        onChange={(e) => setStationId(e.target.value)}
        value={stationId}
      >
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>
      <br />
      Way time in mintes
      <br />
      From first station
      <input
        type="number"
        placeholder="From first station"
        value={wayFromFirstStation}
        onChange={(e) => setWayFromFirstStation(Number(e.target.value))}
        required
      />
      <br />
      From last station
      <input
        type="number"
        placeholder="From last station"
        value={wayFromLastStation}
        onChange={(e) => setWayFromLastStation(Number(e.target.value))}
        required
      />
      <br />
      Train stand
      <br />
      To
      <input
        type="number"
        placeholder="To"
        value={trainStandFromFirstStation}
        onChange={(e) => setTrainStandFromFirstStation(Number(e.target.value))}
        required
      />
      <br />
      From
      <input
        type="number"
        placeholder="input"
        value={trainStandFromLastStation}
        onChange={(e) => setTrainStandFromLastStation(Number(e.target.value))}
        required
      />
      <button type="submit">Create train departure time</button>
      {errorAlert}
    </form>
  );
};
