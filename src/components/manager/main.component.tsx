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
import { CreateTrainType } from './create-train-type.component';
import { DeleteTrainType } from './delete-train-type.component';
import { CreateTrain } from './create-train.component';
import { DeleteTrain } from './delete-train.component';
import { UpdateTrain } from './update-train.component';
import { AddStationToRoute } from './add-station-to-route.component';
import { UpdateStationOnRoute } from './update-station-on-route.component';
import { DeleteStationFromRoute } from './delete-station-on-route.component';
import { CreateTrainDeparture } from './create-train-departure.component';
import { DeleteTrainDeparture } from './delete-train-departure.component';
import { CreateTrainAtStation } from './create-train-at-station.component';
import { CreateCarriageType } from './create-carriage-type.component';
import { DeleteCarriageType } from './delete-carriage-type.component';
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
      title: localization.createRoute[user.language],
      component: CreateRoute,
    },
    {
      title: localization.updateRoute[user.language],
      component: UpdateRoute,
    },
    {
      title: localization.deleteRoute[user.language],
      component: DeleteRoute,
    },
    {
      title: localization.createStation[user.language],
      component: CreateStation,
    },
    {
      title: localization.updateStation[user.language],
      component: UpdateStation,
    },
    {
      title: localization.deleteStation[user.language],
      component: DeleteStation,
    },
    {
      title: localization.addStationToRoute[user.language],
      component: AddStationToRoute,
    },
    {
      title: localization.updateStationOnRoute[user.language],
      component: UpdateStationOnRoute,
    },
    {
      title: localization.deleteStationOnRoute[user.language],
      component: DeleteStationFromRoute,
    },
    {
      title: localization.createTrain[user.language],
      component: CreateTrainType,
    },
    {
      title: 'Delete train type',
      component: DeleteTrainType,
    },
    {
      title: localization.createTrain[user.language],
      component: CreateTrain,
    },
    {
      title: localization.updateTrain[user.language],
      component: UpdateTrain,
    },
    {
      title: localization.deleteTrain[user.language],
      component: DeleteTrain,
    },
    {
      title: localization.createTrainDepartureTime[user.language],
      component: CreateTrainDeparture,
    },
    {
      title: localization.deleteTrainDeparture[user.language],
      component: DeleteTrainDeparture,
    },
    {
      title: localization.createTrainAtStation[user.language],
      component: CreateTrainAtStation,
    },
    {
      title: 'Create new carriage type',
      component: CreateCarriageType,
    },
    {
      title: 'Delete carriage type',
      component: DeleteCarriageType,
    },
    {
      title: localization.createCarriage[user.language],
      component: CreateCarriage,
    },
    {
      title: localization.deleteCarriage[user.language],
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
