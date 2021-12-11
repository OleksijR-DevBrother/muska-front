import styles from './css/styles.module.scss';

import { FunctionComponent } from 'react';
import { Route, useRouteMatch, Switch, Redirect, Link } from 'react-router-dom';

import { useStoreDispatch } from '../../redux/store';
import { updateUser } from '../../redux/slices/user.slice';
import { SearchTrainsBetweenStations } from './search-trains-between-stations.component';

export const PassengerMain: FunctionComponent = () => {
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

          <h2>
            <Link
              to={path + '/search-trains-berween-stations'}
              style={{ marginRight: '20px' }}
            >
              Search trains between stations
            </Link>
          </h2>

          <Switch>
            <Route
              path={path + '/search-trains-berween-stations'}
              component={SearchTrainsBetweenStations}
            />

            <Route
              path=""
              render={() => (
                <Redirect to={path + '/search-trains-berween-stations'} />
              )}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};
