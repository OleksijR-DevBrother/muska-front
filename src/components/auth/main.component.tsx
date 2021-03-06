import styles from './css/styles.module.scss';

import { FunctionComponent } from 'react';
import { Route, useRouteMatch, Switch, Redirect } from 'react-router-dom';

import { Login } from './login.component';
import { SignUp } from './signup.component';
import { localization } from '../../localization';
import { useStoreSelector } from '../../redux/store';

export const AuthMain: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);
  const { path } = useRouteMatch();

  return (
    <div className={styles['auth-block']}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h1>{localization.welcome[user.language]}</h1>

          <Switch>
            <Route exact path={path + '/login'} component={Login} />
            <Route exact path={path + '/signup'} component={SignUp} />

            <Route path="" render={() => <Redirect to={path + '/login'} />} />
          </Switch>
        </div>
      </div>
    </div>
  );
};
