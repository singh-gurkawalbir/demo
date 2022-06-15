import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PanelHeader from '../../../components/PanelHeader';
import Stepper from './Stepper';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import ConnectDevice from './ConnectDevice';

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
        <Step1 />
      </Stepper>
      <Stepper index={2}>
        <Step2 />
      </Stepper>
      <Stepper index={3}>
        <Step3 />
      </Stepper>
      <ConnectDevice />
    </div>
  );
}

