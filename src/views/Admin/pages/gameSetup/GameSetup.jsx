import { useState } from 'react';
// Material components
import TextField from '@mui/material/TextField';
import { FormLabel, FormControl, Radio, RadioGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
import WarehouseAlert from '../../../../components/ui/WarehouseAlert';
// Utils
import { getCurrentTime } from '../../../../utils/functions/getCurrentTime';
// Firebase services
import { createInstance } from '../../../../Database/firestore';
import { serverTimestamp } from 'firebase/firestore';
// Helpers
import { questions } from './helpers';
// Css
import './GameSetup.css';

export default function GameSetup() {
  const [showClassCreatedAlert, setShowClassCreatedAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    let configuration = {};

    configuration['Class Number'] = event.target['Class Number'].value;
    configuration['Number Of rounds'] = event.target['Number Of rounds'].value;
    configuration['Max members in a team'] =
      event.target['Max members in a team'].value;
    configuration[`previous_rounds`] = [];
    configuration[`current_round`] = 1;
    configuration['start_time'] = serverTimestamp(
      new Date(event.target['start_time'].value)
    );
    configuration['Total no. of teams'] =
      event.target['Total no. of teams'].value;
    configuration['Number Of SKU'] = event.target['Number Of SKU'].value;
    for (let index = 0; index < questions.length; index++) {
      const element = questions[index];
      configuration[element.question] =
        event.target[element.id + '-radio'].value;
    }
    await createInstance(configuration);

    setShowClassCreatedAlert(true);
    setTimeout(() => {
      setShowClassCreatedAlert(false);
    }, 10000);
  };

  return (
    <div className="gameSetup">
      <form onSubmit={handleSubmit}>
        <WarehouseHeader title="Configure a game">
          <WarehouseButton text="Submit" />
        </WarehouseHeader>
        <WarehouseCard>
          {showClassCreatedAlert && (
            <WarehouseAlert text="Class has been created successfully" />
          )}
          <div className="gameSetup__inputs">
            <TextField
              label="Class Number"
              id="Class Number"
              defaultValue={'Class 1'}
              size="medium"
            />
            <TextField
              label="Number Of rounds"
              id="Number Of rounds"
              defaultValue={3}
              size="medium"
            />
            <TextField
              label="Max members in a team"
              id="Max members in a team"
              defaultValue={5}
              size="medium"
            />
            <TextField
              label="Total no. of teams"
              id="Total no. of teams"
              defaultValue={5}
              size="medium"
            />
            <TextField
              label="Number Of SKU"
              id="Number Of SKU"
              defaultValue={12}
              size="medium"
            />
            <TextField
              id="start_time"
              label="start_time"
              type="datetime-local"
              defaultValue={getCurrentTime()}
              sx={{ width: 250 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
          <div className="gameSetup__questions">
            {questions.map(({ id, question, answers }) => (
              <FormControl sx={{ m: 1 }} key={id}>
                <FormLabel
                  style={{ color: '#393145', fontSize: '1.25rem' }}
                  id="radio-buttons-group"
                >
                  {question}
                </FormLabel>
                <RadioGroup
                  aria-labelledby="radio-buttons-group"
                  defaultValue={answers[0]}
                  name={id + '-radio'}
                >
                  {answers.map((answer) => (
                    <FormControlLabel
                      key={answer}
                      value={answer}
                      control={<Radio />}
                      label={answer}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            ))}
          </div>
        </WarehouseCard>
      </form>
    </div>
  );
}
