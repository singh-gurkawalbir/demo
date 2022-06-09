import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PanelHeader from '../../../components/PanelHeader';
import Stepper from './Stepper';

const useStyles = makeStyles(theme => ({
  footer: {
    margin: theme.spacing(2),
  },
  flexContainer: {
    display: 'flex',
    '& + div': {
      marginTop: theme.spacing(2),
    },
  },
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
  },
  spinner: {
    marginLeft: theme.spacing(0.5),
    display: 'flex',
  },
}));

export default function MFA() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PanelHeader title="MFA" />
      <Stepper index={1}>
        <div className={classes.step1}>
          <b> header </b>
          <div>
            <input type="text" />
          </div>
        </div>
      </Stepper>
      <Stepper index={2}>
        <div className={classes.step1}>
          <b> header </b>
          <div>
            <input type="text" />
          </div>
        </div>
      </Stepper>
      <Stepper index={3}>
        <div className={classes.step1}>
          <b> header </b>
          <div>
            <input type="text" />
            <br />
            <input type="text" />
          </div>
        </div>
      </Stepper>
      <Stepper index={4} isLast>
        <div className={classes.step1}>
          <b> header </b>
          <div>
            <input type="text" />
            <br />
            <input type="text" />
            <br />
            <input type="text" />
            <input type="text" />
            <br />
            <input type="text" />
            <input type="text" />
            <input type="text" />
            <br />
          </div>
        </div>
      </Stepper>
    </div>
  );
}
