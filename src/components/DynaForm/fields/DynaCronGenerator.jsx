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
    width: '100%',
  },
  resetBtn: {
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginTop: 28,
  },
}));

export default function DynaCronGenerator(props) {
  const classes = useStyles();
  const { onFieldChange, id, value } = props;
  const [reset, setReset] = useState(false);
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
            setReset(true);
            onChange('');
          }}>
          Reset
        </Button>
      </div>
      <CronBuilder
        reset={reset}
        setReset={setReset}
        value={value}
        onChange={onChange}
      />
    </>
  );
}
