import { useEffect, useState } from 'react';
// Hooks
import { useCollection } from '../../../../hooks/useCollection';
import { useFirestore } from '../../../../hooks/useFirestore';
// Material Components
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseLoader from '../../../../components/ui/WarehouseLoader';
import WarehouseAlert from '../../../../components/ui/WarehouseAlert';
import Chart from '../../../../components/chart/Chart';
// Firebase services
import { getCollection } from '../../../../Database/firestoreService';
// Helpers
import { getXAxisCategories } from './helpers';
import { getTeamsChartData } from './helpers/getTeamsChartData';
// Constants
import { COLLECTION_CLASSES } from '../../../../utils/constants';
// Css
import './Home.css';

export default function Home() {
  const [selectedClass, setSelectedClass] = useState('');

  const {
    documents: classes,
    isPending: classesPending,
    error: classesError,
  } = useCollection(COLLECTION_CLASSES);

  const { response: classCollection, callFirebaseService } = useFirestore();

  useEffect(() => {
    selectedClass &&
      (async () => {
        await callFirebaseService(getCollection(selectedClass));
      })();
  }, [selectedClass]);

  return (
    <div className="home">
      <WarehouseHeader title="Team Score">
        {classesPending ? (
          <WarehouseLoader />
        ) : classesError ? (
          <WarehouseAlert text={classesError} severity="error" />
        ) : !classes.length ? (
          <WarehouseAlert text="No classes found" />
        ) : (
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel>Class</InputLabel>
            <Select
              value={selectedClass}
              label="Class"
              onChange={(e) => {
                setSelectedClass(e.target.value);
              }}
            >
              {classes.map(({ id }) => (
                <MenuItem key={id} value={id}>
                  {id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </WarehouseHeader>

      <WarehouseCard>
        {!selectedClass ? (
          <WarehouseAlert text="Select a class" />
        ) : classCollection.isPending ? (
          <WarehouseLoader />
        ) : classCollection.error ? (
          <WarehouseAlert text={classCollection.error} />
        ) : !classCollection.document?.length ? (
          <WarehouseAlert text="No points to shwo" />
        ) : (
          <Chart
            series={getTeamsChartData(classCollection?.document, 'Points').map(
              (elm) => {
                return {
                  name: elm.round,
                  data: elm.scores,
                };
              }
            )}
            xAxis={getXAxisCategories(
              'Team',
              getTeamsChartData(classCollection?.document, 'Points')[0]?.scores
            )}
            type="column"
            chartType="bar"
          />
        )}
      </WarehouseCard>

      <WarehouseHeader my title="IRI Score" />

      <WarehouseCard>
        {!selectedClass ? (
          <WarehouseAlert text="Select a class" />
        ) : classCollection.isPending ? (
          <WarehouseLoader />
        ) : classCollection.error ? (
          <WarehouseAlert text={classCollection.error} />
        ) : !classCollection.document?.length ? (
          <WarehouseAlert text="No points to shwo" />
        ) : (
          <Chart
            series={getTeamsChartData(classCollection?.document, 'IRI').map(
              (elm) => {
                return {
                  name: elm.round,
                  data: elm.scores,
                };
              }
            )}
            xAxis={getXAxisCategories(
              'Team',
              getTeamsChartData(classCollection?.document, 'IRI')[0]?.scores
            )}
            type="column"
            chartType="bar"
          />
        )}
      </WarehouseCard>
    </div>
  );
}
