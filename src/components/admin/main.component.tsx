import styles from './css/styles.module.scss';

import { FunctionComponent } from 'react';
import { Route, useRouteMatch, Switch, Redirect, Link } from 'react-router-dom';

import { AddUser } from './add-user.component';
import { UsersList } from './user-list.component';
import { useStoreDispatch } from '../../redux/store';
import { updateUser } from '../../redux/slices/user.slice';

export const AdminMain: FunctionComponent = () => {
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

          <h1 style={{ marginBottom: '20px' }}>TickTrip Admin</h1>

          <h2
            style={{
              marginBottom: '20px',
            }}
          >
            <Link to={path + '/add-user'} style={{ marginRight: '20px' }}>
              Add new user
            </Link>
            <Link to={path + '/user-list'}>List of users</Link>
          </h2>

          <Switch>
            <Route exact path={path + '/add-user'} component={AddUser} />
            <Route exact path={path + '/user-list'} component={UsersList} />

            <Route
              path=""
              render={() => <Redirect to={path + '/user-list'} />}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};
