import { FunctionComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { useStoreSelector } from './redux/store';
import { AuthMain } from './components/auth/main.component';
import { AdminMain } from './components/admin/main.component';
import { ManagerMain } from './components/manager/main.component';
import { PassengerMain } from './components/passenger/main.component';

export const App: FunctionComponent = () => {
  const user = useStoreSelector((state) => state.user);

  return !user.role?.length ? (
    <Switch>
      <Route path="/auth" component={AuthMain} />

      <Route path="" render={() => <Redirect to="/auth/login" />} />
    </Switch>
  ) : user.role === 'admin' ? (
    <Switch>
      <Route path="/admin" component={AdminMain} />

      <Route path="" render={() => <Redirect to="/admin/user-list" />} />
    </Switch>
  ) : user.role === 'manager' ? (
    <Switch>
      <Route path="/manager" component={ManagerMain} />

      <Route path="" render={() => <Redirect to="/manager/add-route" />} />
    </Switch>
  ) : (
    <Switch>
      <Route path="/trains" component={PassengerMain} />

      <Route path="" render={() => <Redirect to="/trains" />} />
    </Switch>
  );
};
