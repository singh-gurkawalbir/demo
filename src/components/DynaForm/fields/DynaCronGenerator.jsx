import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CronBuilder from '../../CronBuilder';
import DynaText from './DynaText';

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
        <Button
          variant="outlined"
          color="secondary"
          className={classes.resetBtn}
          onClick={() => {
            setReset(count => count + 1);
            onChange('');
          }}>
          Reset
        </Button>
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
