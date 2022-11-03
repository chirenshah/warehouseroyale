// Material components
import TextField from '@mui/material/TextField';
import { FormLabel, FormControl, Radio, RadioGroup } from '@mui/material';
import { FormControlLabel } from '@mui/material';
// Components
import WarehouseHeader from '../../../../components/ui/WarehouseHeader';
import WarehouseCard from '../../../../components/ui/WarehouseCard';
import WarehouseButton from '../../../../components/ui/WarehouseButton';
// Helpers
import { questions } from './helpers';
// Css
import './GameSetup.css';

export default function GameSetup() {
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('form submitted !');
  };

  return (
    <div className="gameSetup">
      <WarehouseHeader>
        <div className="gameSetup__inputs">
          <TextField label="Number Of rounds" defaultValue={3} size="medium" />
          <TextField
            label="Max members in a team"
            defaultValue={5}
            size="medium"
          />
          <TextField
            label="Total no. of teams"
            defaultValue={5}
            size="medium"
          />
          <TextField label="Number Of SKU" defaultValue={12} size="medium" />
        </div>
      </WarehouseHeader>
      <WarehouseCard>
        <form onSubmit={handleSubmit} className="gameSetup__questions">
          {questions.map(({ id, question, answers }) => (
            <FormControl key={id}>
              <FormLabel
                style={{ color: '#393145', fontSize: '1.25rem' }}
                id="radio-buttons-group"
              >
                {question}
              </FormLabel>
              <RadioGroup
                aria-labelledby="radio-buttons-group"
                defaultValue={answers[0]}
                name="radio-buttons-group"
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
          <WarehouseButton text="Submit" />
        </form>
      </WarehouseCard>
    </div>
  );
}
