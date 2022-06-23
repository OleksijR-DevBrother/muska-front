import styles from './css/styles.module.scss';

import { FunctionComponent, useState } from 'react';
import { Route, useRouteMatch, Switch, Redirect, Link } from 'react-router-dom';

import { useStoreDispatch, useStoreSelector } from '../../redux/store';
import { updateUser } from '../../redux/slices/user.slice';
import { SearchTrainsBetweenStations } from './search-trains-between-stations.component';
import { SearchWaysBetweenStations } from './search-ways-between-stations.component';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { localization } from '../../localization';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export const PassengerMain: FunctionComponent = () => {
  const user = useStoreSelector((store) => store.user);
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

  // const { path } = useRouteMatch();

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={styles['auth-block']}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h1 style={{ marginBottom: '20px' }}>TickTrip</h1>

          <form onSubmit={logout}>
            <button type="submit">{localization.logout[user.language]}</button>
          </form>

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              height: 224,
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab
                style={{ color: 'white', fontSize: 15 }}
                label={localization.searchTrainsBetweenStations[user.language]}
                {...a11yProps(0)}
              />
              <Tab
                style={{ color: 'white', fontSize: 15 }}
                label={localization.searchWaysBetweenStations[user.language]}
                {...a11yProps(1)}
              />
            </Tabs>
            <TabPanel value={value} index={0}>
              <SearchTrainsBetweenStations />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <SearchWaysBetweenStations />
            </TabPanel>
          </Box>

          {/* <h1 style={{ marginBottom: '20px' }}>TickTrip</h1>

          <h2>
            <Link
              to={path + '/search-trains-between-stations'}
              style={{ marginRight: '20px' }}
            >
              Search trains between stations
            </Link>
          </h2>

          <h2>
            <Link
              to={path + '/search-ways-between-stations'}
              style={{ marginRight: '20px' }}
            >
              Search ways between stations
            </Link>
          </h2>

          <Switch>
            <Route
              path={path + '/search-trains-between-stations'}
              component={SearchTrainsBetweenStations}
            />

            <Route
              path={path + '/search-ways-between-stations'}
              component={SearchWaysBetweenStations}
            />

            <Route
              path=""
              render={() => (
                <Redirect to={path + '/search-trains-between-stations'} />
              )}
            />
          </Switch> */}
        </div>
      </div>
    </div>
  );
};
