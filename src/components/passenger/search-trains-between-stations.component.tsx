import styles from './css/styles.module.scss';

import { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';

import { config } from '../../config';
import { useStoreSelector } from '../../redux/store';

interface SearchResult {
  id: string;
  name: string;
  routeName: string;
  departureTime: string;
  arrivalTime: string;
}

export const SearchTrainsBetweenStations: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [fromStationId, setFromStationId] = useState('');
  const [toStationId, setToStationId] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [error, setError] = useState('');

  const [searchResults, setSearchResults] = useState([] as SearchResult[]);

  const SearchTrains = async (e: any) => {
    e.preventDefault();

    const url = new URL(
      '/stations/get/trains/between-two-stations',
      config.trainsUrl,
    ).toString();
    const res = await axios.get(url, {
      params: {
        firstStationId: fromStationId,
        secondStationId: toStationId,
        departureDate,
      },
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    if (res.status > 300) {
      setError(res.data.message);
      return;
    }

    setSearchResults(res.data);
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

  const errorAlert = error ? <h2 className={styles.error}>{error}</h2> : null;
  return (
    <form className="form" onSubmit={SearchTrains}>
      From
      <select
        style={{ color: 'black' }}
        onChange={(e) => setFromStationId(e.target.value)}
        value={fromStationId}
      >
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
          </option>
        ))}
      </select>
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
      Day
      <input
        type="date"
        value={departureDate}
        onChange={(e) => setDepartureDate(e.target.value)}
      />
      <button type="submit">Search</button>
      {errorAlert}
      {searchResults.map((result) => (
        <div key={result.id}>
          <hr />
          <h3>{result.id}</h3>
        </div>
      ))}
    </form>
  );
};
