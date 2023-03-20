import React, { useCallback, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import CronBuilder from '../../CronBuilder';
import DynaText from './DynaText';
import OutlinedButton from '../../Buttons/OutlinedButton';

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexDirection: 'row !important',
    display: 'flex',
  },
  field: {
    flex: 1,
  },
  resetBtn: {
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginTop: 28,
  },
}));
// its just a expression for scheduling a flowbuilder can be loggable
export default function DynaCronGenerator(props) {
  const classes = useStyles();
  const { onFieldChange, id, value, scheduleStartMinuteOffset} = props;
  const [reset, setReset] = useState(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChange = useCallback(
    (value, touched) => onFieldChange(id, value, touched),
    [id, onFieldChange]
  );

  return (
    <>
      <div className={classes.wrapper}>
        <DynaText className={classes.field} {...props} disabled />
        <OutlinedButton
          className={classes.resetBtn}
          onClick={() => {
            setReset(count => count + 1);
            onChange('');
          }}>
          Reset
        </OutlinedButton>
      </div>
      <CronBuilder
        key={reset}
        value={value}
        onChange={onChange}
        scheduleStartMinuteOffset={scheduleStartMinuteOffset}
      />
    </>
  );
}
