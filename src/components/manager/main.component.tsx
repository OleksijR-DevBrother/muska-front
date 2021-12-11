import styles from './css/styles.module.scss';

import { FunctionComponent } from 'react';
import { Route, useRouteMatch, Switch, Redirect, Link } from 'react-router-dom';

import { useStoreDispatch } from '../../redux/store';
import { updateUser } from '../../redux/slices/user.slice';
import { CreateRoute } from './create-route.component';
import { CreateStation } from './create-station.component';
import { CreateTrain } from './create-train.component';
import { AddStationToRoute } from './add-station-to-route.component';
import { CreateTrainDeparture } from './create-train-departure.component';
import { CreateTrainAtStation } from './create-train-at-station.component';

export const ManagerMain: FunctionComponent = () => {
  const dispatch = useStoreDispatch();
  const logout = (e: any) => {
    e.preventDefault();

    dispatch(
      updateUser({
        accessToken: '',
        refreshToken: '',
        role: '',
      }),
    );
  };

  const { path } = useRouteMatch();

  return (
    <div className={styles['auth-block']}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <form onSubmit={logout}>
            <button type="submit">Logout</button>
          </form>

          <h1 style={{ marginBottom: '20px' }}>TickTrip</h1>

          <h2
            style={{
              marginBottom: '20px',
            }}
          >
            <Link to={path + '/create-route'} style={{ marginRight: '20px' }}>
              Create new route
            </Link>
            <Link to={path + '/create-station'} style={{ marginRight: '20px' }}>
              Create new station
            </Link>
            <Link
              to={path + '/add-station-to-route'}
              style={{ marginRight: '20px' }}
            >
              Add station to route
            </Link>
            <Link to={path + '/create-train'} style={{ marginRight: '20px' }}>
              Create new train
            </Link>
            <Link
              to={path + '/create-train-departure'}
              style={{ marginRight: '20px' }}
            >
              Create train departure
            </Link>
            <Link
              to={path + '/create-train-at-station'}
              style={{ marginRight: '20px' }}
            >
              Create train at station
            </Link>
          </h2>

          <Switch>
            <Route
              exact
              path={path + '/create-route'}
              component={CreateRoute}
            />
            <Route
              exact
              path={path + '/create-station'}
              component={CreateStation}
            />
            <Route
              exact
              path={path + '/create-train'}
              component={CreateTrain}
            />
            <Route
              exact
              path={path + '/add-station-to-route'}
              component={AddStationToRoute}
            />
            <Route
              exact
              path={path + '/create-train-departure'}
              component={CreateTrainDeparture}
            />
            <Route
              exact
              path={path + '/create-train-at-station'}
              component={CreateTrainAtStation}
            />

            <Route
              path=""
              render={() => <Redirect to={path + '/create-route'} />}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};
