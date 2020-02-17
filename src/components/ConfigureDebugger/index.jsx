import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { useState } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../actions';
import ModalDialog from '../ModalDialog';

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2, 0),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
  radioLabel: {
    marginLeft: 0,
    marginTop: theme.spacing(0.5),
  },
  label: {
    marginBottom: theme.spacing(1),
  },
}));

export default function ConfigureDebugger(props) {
  const classes = useStyles();
  const { id, name, debugDate, onClose } = props;
  const [debugValue, setDebugValue] = useState(0);
  const [saveLabel, setSaveLabel] = useState('Save');
  const dispatch = useDispatch();
  const handleOnSubmit = () => {
    setSaveLabel('Saving');

    const debugTime = moment()
      .add(debugValue, 'm')
      .toISOString();
    const patchSet = [
      {
        op: debugValue !== '0' ? 'replace' : 'remove',
        path: '/debugDate',
        value: debugTime,
      },
    ];

    dispatch(actions.resource.patch('connections', id, patchSet));
    onClose();
  };

  let minutes;
  let defaultVal;

  if (debugDate) {
    minutes = moment(debugDate).diff(moment(), 'minutes');
  }

  if (!(debugDate && moment().isBefore(moment(debugDate)))) {
    defaultVal = '0';
  }

  return (
    <ModalDialog show onClose={onClose}>
      <div>Configure Debugger: {name}</div>
      <div className={classes.container}>
        <form onSubmit={handleOnSubmit}>
          <FormControl component="fieldset">
            <FormLabel className={classes.label} component="legend">
              Debug Duration:
            </FormLabel>
            <RadioGroup
              name="debugDuration"
              defaultValue={defaultVal}
              // value={searchType}
              onChange={evt => setDebugValue(evt.target.value)}>
              <FormControlLabel
                value="0"
                control={<Radio color="primary" />}
                label="Off"
                className={classes.radioLabel}
              />
              {['15', '30', '45', '60'].map(duration => (
                <FormControlLabel
                  key={duration}
                  value={duration}
                  control={<Radio color="primary" />}
                  label={`Next ${duration} mins`}
                />
              ))}
            </RadioGroup>
          </FormControl>
          {minutes > 1 && (
            <Typography variant="body2" className={classes.submit}>
              Debug mode is enabled for next {minutes} minutes.
            </Typography>
          )}
          <Button
            data-test="saveDebuggerConfiguration"
            variant="outlined"
            color="primary"
            type="submit"
            className={classes.submit}
            value="Save">
            {saveLabel}
          </Button>
        </form>
      </div>
    </ModalDialog>
  );
}
