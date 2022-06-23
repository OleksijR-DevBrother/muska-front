import styles from './css/styles.module.scss';

import { FunctionComponent, useState } from 'react';
import { Route, useRouteMatch, Switch, Redirect, Link } from 'react-router-dom';

import { useStoreDispatch, useStoreSelector } from '../../redux/store';
import { updateUser } from '../../redux/slices/user.slice';
import { CreateRoute } from './create-route.component';
import { CreateStation } from './create-station.component';
import { CreateTrain } from './create-train.component';
import { AddStationToRoute } from './add-station-to-route.component';
import { CreateTrainDeparture } from './create-train-departure.component';
import { CreateTrainAtStation } from './create-train-at-station.component';
import { CreateCarriage } from './create-carriage.component';

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

export const ManagerMain: FunctionComponent = () => {
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
                label="Create new route"
                {...a11yProps(0)}
              />
              <Tab
                style={{ color: 'white', fontSize: 15 }}
                label="Create new station"
                {...a11yProps(1)}
              />
              <Tab
                style={{ color: 'white', fontSize: 15 }}
                label="Add station to route"
                {...a11yProps(2)}
              />
              <Tab
                style={{ color: 'white', fontSize: 15 }}
                label="Create new train"
                {...a11yProps(3)}
              />
              <Tab
                style={{ color: 'white', fontSize: 15 }}
                label="Create train departure"
                {...a11yProps(4)}
              />
              <Tab
                style={{ color: 'white', fontSize: 15 }}
                label="Create train at station"
                {...a11yProps(5)}
              />
              <Tab
                style={{ color: 'white', fontSize: 15 }}
                label="Create carriage"
                {...a11yProps(6)}
              />
            </Tabs>
            <TabPanel value={value} index={0}>
              <CreateRoute />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <CreateStation />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <AddStationToRoute />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <CreateTrain />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <CreateTrainDeparture />
            </TabPanel>
            <TabPanel value={value} index={5}>
              <CreateTrainAtStation />
            </TabPanel>
            <TabPanel value={value} index={6}>
              <CreateCarriage />
            </TabPanel>
          </Box>

          {/* <form onSubmit={logout}>
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
            <Link
              to={path + '/create-carriage'}
              style={{ marginRight: '20px' }}
            >
              Create carriage
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
              exact
              path={path + '/create-carriage'}
              component={CreateCarriage}
            />

            <Route
              path=""
              render={() => <Redirect to={path + '/create-route'} />}
            />
          </Switch> */}
        </div>
      </div>
    </div>
  );
};
