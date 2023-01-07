import { useEffect, useState } from 'react';
// Hooks
import { useAuthContext } from '../../hooks/useAuthContext';
import { useConfigurationContext } from '../../hooks/useConfigurationContext';
import { useCollection } from '../../hooks/useCollection';
// Material Components
import WarehouseLoader from '../ui/WarehouseLoader';
import WarehouseAlert from '../ui/WarehouseAlert';
// Components
import PerformanceMetricComp from './PerformanceMetricComp';
// Helpers
import { getRoundwisePointsScores } from './helpers/getRoundwisePointsScores';

export default function PerformanceMetric() {
  const { user: currentUser } = useAuthContext();
  const { configuration } = useConfigurationContext();

  const previousRounds =
    configuration?.previous_rounds.map((round, index) => index + 1) || [];

  const [round, setRound] = useState(1);
  const [performanceMetricData, setPerformanceMetricData] = useState([]);

  const { documents, isPending, error } = useCollection(
    `${currentUser.classId}`
  );

  useEffect(() => {
    const performanceMetric = getRoundwisePointsScores(documents, round);
    setPerformanceMetricData(performanceMetric);
  }, [documents, round]);

  if (isPending) {
    return <WarehouseLoader />;
  }

  if (error) {
    return <WarehouseAlert text={error} severity="error" />;
  }

  if (!previousRounds.length) {
    return <WarehouseAlert text="No rounds to show" />;
  }

  return (
    <PerformanceMetricComp
      previousRounds={previousRounds}
      performanceMetricData={performanceMetricData}
      round={round}
      setRound={setRound}
    />
  );
}
