import styles from './css/styles.module.scss';

import { FunctionComponent, useState } from 'react';

import { localization } from '../../localization';
import { useStoreDispatch, useStoreSelector } from '../../redux/store';
import { updateUser } from '../../redux/slices/user.slice';
import { CreateRoute } from './create-route.component';
import { UpdateRoute } from './update-route.component';
import { DeleteRoute } from './delete-route.component';
import { CreateStation } from './create-station.component';
import { UpdateStation } from './update-station.component';
import { DeleteStation } from './delete-station.component';
import { CreateTrain } from './create-train.component';
import { DeleteTrain } from './delete-train.component';
import { UpdateTrain } from './update-train.component';
import { AddStationToRoute } from './add-station-to-route.component';
import { UpdateStationOnRoute } from './update-station-on-route.component';
import { DeleteStationFromRoute } from './delete-station-on-route.component';
import { CreateTrainDeparture } from './create-train-departure.component';
import { DeleteTrainDeparture } from './delete-train-departure.component';
import { CreateTrainAtStation } from './create-train-at-station.component';
import { CreateCarriage } from './create-carriage.component';
import { DeleteCarriage } from './delete-carriage.component';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

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

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tabs = [
    {
      title: 'Create new route',
      component: CreateRoute,
    },
    {
      title: 'Update route',
      component: UpdateRoute,
    },
    {
      title: 'Delete route',
      component: DeleteRoute,
    },
    {
      title: 'Create new station',
      component: CreateStation,
    },
    {
      title: 'Update station',
      component: UpdateStation,
    },
    {
      title: 'Delete station',
      component: DeleteStation,
    },
    {
      title: 'Add station to route',
      component: AddStationToRoute,
    },
    {
      title: 'Update station on route',
      component: UpdateStationOnRoute,
    },
    {
      title: 'Delete station from route',
      component: DeleteStationFromRoute,
    },
    {
      title: 'Create new train',
      component: CreateTrain,
    },
    {
      title: 'Update train',
      component: UpdateTrain,
    },
    {
      title: 'Delete train',
      component: DeleteTrain,
    },
    {
      title: 'Create train departure',
      component: CreateTrainDeparture,
    },
    {
      title: 'Delete train departure',
      component: DeleteTrainDeparture,
    },
    {
      title: 'Create train at station',
      component: CreateTrainAtStation,
    },
    {
      title: 'Create new carriage',
      component: CreateCarriage,
    },
    {
      title: 'Delete carriage',
      component: DeleteCarriage,
    },
  ];

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
              {tabs.map((tab, index) => (
                <Tab
                  style={{ color: 'white', fontSize: 15 }}
                  label={tab.title}
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>

            {tabs.map((tab, index) => (
              <TabPanel value={value} index={index}>
                <tab.component />
              </TabPanel>
            ))}
          </Box>
        </div>
      </div>
    </div>
  );
};
