import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';

type SearchResult = {
  trainsNumbers: string[];
  stationsNames: string[];
  length: number;
};

export const SearchWaysBetweenStations: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [fromStationId, setFromStationId] = useState('');
  const [toStationId, setToStationId] = useState('');
  const [error, setError] = useState('');

  const [searchResults, setSearchResults] = useState([] as SearchResult[]);

  const SearchTrains = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      '/trains/ways-between-two-stations',
      config.trainsUrl,
    ).toString();
    const res = await axios.get(url, {
      params: {
        fromStationId,
        toStationId,
      },
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    if (res.status > 300) {
      setError(res.data.message);
      return;
    }

    setSearchResults(
      res.data.map((item: any) => ({
        trainsNumbers: item.trains.map((train: any) => train.name),
        stationsNames: item.stations.map((station: any) => station.name),
        length: item.length,
      })),
    );
    setError('');
  };

  const [stations, setStations] = useState([] as any[]);

  const loadData = async () => {
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
      setFromStationId(stations[0].id);
      setToStationId(stations[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const msToTime = (ms: number | string) => {
    let res = `${Math.floor(Number(ms) / 3600000)}:`;
    if (Number(ms) % 3600000 < 600000) {
      res += '0';
    }
    res += Math.floor((Number(ms) % 3600000) / 60000);
    return res;
  };

  console.log(fromStationId);

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form className="form" onSubmit={SearchTrains} style={{ fontSize: 15 }}>
      From
      <select
        style={{ color: 'black' }}
        onChange={(e) => {
          console.log(e.target.value);
          setFromStationId(e.target.value);
        }}
        value={fromStationId}
      >
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>
      <br />
      <br />
      To
      <select
        style={{ color: 'black' }}
        onChange={(e) => setToStationId(e.target.value)}
        value={toStationId}
      >
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>
      <br />
      <br />
      <button type="submit">Search</button>
      {errorAlert}
      {searchResults.map((result, index) => (
        <div key={index}>
          <hr />
          {result.trainsNumbers.map((trainNumber, trainIndex) => (
            <a style={{ fontSize: 30 }}>
              {result.stationsNames[trainIndex]} -{' '}
              <b style={{ fontWeight: 900 }}>Train: {trainNumber}</b> -{' '}
            </a>
          ))}
          <a style={{ fontSize: 30 }}>
            {result.stationsNames[result.stationsNames.length - 1]}
          </a>
        </div>
      ))}
    </form>
  );
};