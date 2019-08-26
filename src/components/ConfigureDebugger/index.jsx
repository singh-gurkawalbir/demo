import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import { useState } from 'react';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import actions from '../../actions';

const styles = theme => ({
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
});

function ConfigureDebugger(props) {
  const { id, classes, width = '70vw', name, debugDate, onClose } = props;
  const [debugValue, setDebugValue] = useState(0);
  const [saveLabel, setSaveLabel] = useState('Save');
  const dispatch = useDispatch();
  const handleOnSubmit = e => {
    e.preventDefault();
    setSaveLabel('Saving');
    dispatch(actions.resourceForm.configureDebugger(id, debugValue, onClose));
  };

  let minutes;
  let defaultVal;

  if (debugDate) {
    minutes = moment(debugDate).diff(moment(), 'minutes');
  }

  if (!(debugDate && moment().isBefore(moment(debugDate)))) {
    defaultVal = '0';
  }

  const handleChange = evt => {
    setDebugValue(evt.target.value);
  };

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
      <DialogContent style={{ width }}>
        <form onSubmit={handleOnSubmit}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Debug Duration:</FormLabel>
            <RadioGroup
              name="debugDuration"
              defaultValue={defaultVal}
              // value={searchType}
              onChange={handleChange}>
              <FormControlLabel value="0" control={<Radio />} label="Off" />
              <FormControlLabel
                value="15"
                control={<Radio />}
                label="Next 15 mins"
              />
              <FormControlLabel
                value="30"
                control={<Radio />}
                label="Next 30 mins"
              />
              <FormControlLabel
                value="45"
                control={<Radio />}
                label="Next 45 mins"
              />
              <FormControlLabel
                value="60"
                control={<Radio />}
                label="Next 60 mins"
              />
            </RadioGroup>
          </FormControl>
          {debugDate && minutes > 1 && (
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

export default withStyles(styles)(ConfigureDebugger);
