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
  travelTime: string;
  typeName: string;
  wayFromStart: number;
}

export const SearchTrainsBetweenStations: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);

  const [fromStationId, setFromStationId] = useState('');
  const [toStationId, setToStationId] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [selectedTrainId, setSelectedTrainId] = useState('');
  const [selectedCarriageId, setSelectedCarriageId] = useState('');
  const [selectedSittingId, setSelectedSittingId] = useState('');
  const [error, setError] = useState('');

  const [searchResults, setSearchResults] = useState([] as SearchResult[]);
  const [searchDepartureDate, setSearchDepartureDate] = useState('');
  const [departureDateTime, setDepartureDateTime] = useState('');

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

    setSearchDepartureDate(departureDate);
    setSearchResults(res.data);
    setError('');
  };

  const [stations, setStations] = useState([] as any[]);
  const [carriages, setCarriages] = useState([] as any[]);
  const [sittings, setSittings] = useState([] as any[]);

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

    if (selectedTrainId) {
      const { data } = await axios.get(
        new URL('/carriages/get/list', config.trainsUrl).toString(),
        {
          params: {
            trainId: selectedTrainId,
          },
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      setCarriages(data);

      if (data.length && !selectedCarriageId) {
        setSelectedCarriageId(data[0].id);
      }
    }

    if (selectedCarriageId) {
      const { data } = await axios.get(
        new URL('/carriages/get/sittings', config.trainsUrl).toString(),
        {
          params: {
            carriageId: selectedCarriageId,
            departureDateTime,
          },
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      setSittings(data);

      if (data.length && !selectedSittingId) {
        setSelectedSittingId(data[0].id);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedTrainId, selectedCarriageId]);

  const msToTime = (ms: number | string) => {
    let res = `${Math.floor(Number(ms) / 3600000)}:`;
    if (Number(ms) % 3600000 < 600000) {
      res += '0';
    }
    res += Math.floor((Number(ms) % 3600000) / 60000);
    return res;
  };

  const selectTrain = (trainId: string, departure: number) => {
    setSelectedTrainId(trainId);
    setDepartureDateTime(
      new Date(
        new Date(searchDepartureDate).valueOf() + departure,
      ).toISOString(),
    );
  };

  const buyTicket = async () => {
    const { data } = await axios.post(
      new URL('/tickets/buy', config.trainsUrl).toString(),
      {
        sittingId: selectedSittingId,
        departureDateTime,
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
  };

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
          <h3>Route: {result.routeName}</h3>
          <h3>Train number: {result.name}</h3>
          <h3>Departure time: {msToTime(result.departureTime)}</h3>
          <h3>Travel time: {msToTime(result.travelTime)}</h3>

          <button
            onClick={() =>
              selectTrain(
                result.id,
                Number(result.departureTime) - result.wayFromStart,
              )
            }
          >
            See free sittings
          </button>

          {selectedTrainId === result.id ? (
            <>
              <br />
              Carriage
              <select
                style={{ color: 'black' }}
                value={selectedCarriageId}
                onChange={(e) => setSelectedCarriageId(e.target.value)}
              >
                {carriages.map((carriage) => (
                  <option value={carriage.id}>
                    {carriage.indexInTrain} {carriage.typeName}
                  </option>
                ))}
              </select>
              {selectedCarriageId ? (
                <>
                  <br />
                  Sitting
                  <select
                    style={{ color: 'black' }}
                    value={selectedSittingId}
                    onChange={(e) => setSelectedSittingId(e.target.value)}
                  >
                    {sittings.map((sitting) => (
                      <option value={sitting.sittingId}>
                        {sitting.indexInCarriage}
                      </option>
                    ))}
                  </select>
                </>
              ) : null}
              <button onClick={buyTicket}>Buy ticket</button>
            </>
          ) : null}
        </div>
      ))}
    </form>
  );
};
