import { FunctionComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router';

import { useStoreSelector } from './redux/store';
import { AuthMain } from './components/auth/main.component';
import { AdminMain } from './components/admin/main.component';

export const App: FunctionComponent = () => {
  const user = useStoreSelector((state) => state.user);

  return !user.accessToken?.length ? (
    <Switch>
      <Route path="/auth" component={AuthMain} />

      <Route path="" render={() => <Redirect to="/auth/login" />} />
    </Switch>
  ) : (
    <Switch>
      <Route path="/admin" component={AdminMain} />

      <Route path="" render={() => <Redirect to="/admin/user-list" />} />
    </Switch>
  );
};
