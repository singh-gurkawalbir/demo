import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Stepper from '../Stepper';
import MFACodeGeneration from '../MFACodeGeneration';
import MobileCodeVerification from '../MobileCodeVerification';
import ConnectDevice from '../ConnectDevice';
import HeaderWithHelpText from '../HeaderWithHelpText';
import actions from '../../../../../actions';
import RouterPrompt from '../RouterPrompt';
import { message } from '../../../../../utils/messageStore';

const useStyles = makeStyles(() => ({
  verificationLabel: {
    '& .MuiFormLabel-root': {
      fontSize: 17,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
}));

export default function MFASetup() {
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => () => dispatch(actions.mfa.clear()), [dispatch]);

  return (
    <>
      <RouterPrompt show />
      <Stepper index={1}>
        <HeaderWithHelpText title="Get verification app" helpKey="mfa.getVerificationApp">
          <Typography variant="h5" component="span">Get verification app</Typography>
        </HeaderWithHelpText>
        <div>{message.MFA.INSTALL_AUTHENTICATOR}</div>
      </Stepper>
      <Stepper index={2}>
        <MFACodeGeneration />
      </Stepper>
      <Stepper index={3}>
        <MobileCodeVerification className={classes.verificationLabel} />
      </Stepper>
      <ConnectDevice />
    </>
  );
}
