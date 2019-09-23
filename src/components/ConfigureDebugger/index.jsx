import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { useState } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  title: {
    marginLeft: 35,
    padding: theme.spacing(2),
  },
  submit: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  closeButton: {
    position: 'absolute',
    right: '10px',
    top: '10px',
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
    <Dialog open maxWidth={false}>
      <IconButton
        aria-label="Close"
        className={classes.closeButton}
        onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <DialogTitle>
        <Typography>{name}</Typography>
      </DialogTitle>
      <DialogContent style={{ width: '70vw' }}>
        <form onSubmit={handleOnSubmit}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Debug Duration:</FormLabel>
            <RadioGroup
              name="debugDuration"
              defaultValue={defaultVal}
              // value={searchType}
              onChange={evt => setDebugValue(evt.target.value)}>
              <FormControlLabel
                value="0"
                control={<Radio color="primary" />}
                label="Off"
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
            <Typography>
              Debug mode is enabled for next {minutes} minutes.
            </Typography>
          )}
          <div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className={classes.submit}
              value="Save">
              {saveLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
