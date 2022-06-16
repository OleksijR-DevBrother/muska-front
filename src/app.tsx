import { FunctionComponent } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

import { AuthMain } from './components/auth/main.component';
import { AdminMain } from './components/admin/main.component';
import { ManagerMain } from './components/manager/main.component';
import { PassengerMain } from './components/passenger/main.component';
import { useStoreSelector, useStoreDispatch } from './redux/store';
import { updateUser } from './redux/slices/user.slice';
import { Language } from './localization';

export const App: FunctionComponent = () => {
  const user = useStoreSelector((state) => state.user);

  const dispatch = useStoreDispatch();
  const changeLanguage = (language: Language) => {
    dispatch(
      updateUser({
        language,
      }),
    );
  };

  return (
    <>
      <Select
        labelId="demo-simple-select-standard-label"
        id="demo-simple-select-standard"
        value={user.language}
        onChange={(e) => changeLanguage(e.target.value as Language)}
        label="Age"
        color="primary"
        style={{ zIndex: 1000, color: 'white', margin: 30, fontSize: 20 }}
      >
        {Object.values(Language).map((language) => (
          <MenuItem key={language} value={language} style={{ fontSize: 20 }}>
            {language}
          </MenuItem>
        ))}
      </Select>
      {!user.role?.length ? (
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
      )}
    </>
  );
};
