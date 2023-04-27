import React, {useState, useCallback} from 'react';
import { useSelector } from 'react-redux';
import QRCode from 'react-qr-code';
import makeStyles from '@mui/styles/makeStyles';
import { Typography } from '@mui/material';
import ReAuthModal from './ReAuthModal';
import HeaderWithHelpText from './HeaderWithHelpText';
import OutlinedButton from '../../../../components/Buttons/OutlinedButton';
import { selectors } from '../../../../reducers';
import { message } from '../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  scanCodeWrapper: {
    marginBottom: theme.spacing(2),
  },
  secretCodeValue: {
    border: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(2, 3),
    margin: theme.spacing(1, 0),
    borderRadius: theme.spacing(1),
    display: 'inline-flex',
    flexDirection: 'column',
  },
  qrCode: {
    marginTop: theme.spacing(1),
  },
  secretCodeMessage: {
    marginTop: theme.spacing(2),
  },
}));

function ViewSecretCode() {
  const [showSecretCodeAuthModal, setShowSecretCodeAuthModal] = useState(false);
  const handleClose = useCallback(
    () => setShowSecretCodeAuthModal(false), [],
  );
  const showSecretCode = useSelector(selectors.showSecretCode);
  const secretCode = useSelector(selectors.secretCode);
  const classes = useStyles();

  return (
    <>
      <div >
        {message.MFA.CANNOT_SCAN}
        <div>
          {
            showSecretCode ? (
              <div>
                <div className={classes.secretCodeValue}>
                  <Typography variant="body2">Account: Celigo</Typography>
                  <Typography variant="body2">Secret key: {secretCode}</Typography>
                </div>
              </div>
            ) : (
              <OutlinedButton className={classes.qrCode} onClick={() => setShowSecretCodeAuthModal(true)}> View account &amp; secret key </OutlinedButton>
            )
          }
        </div>
      </div>
      {showSecretCodeAuthModal && (<ReAuthModal onClose={handleClose} />)}
    </>
  );
}

function ViewQRCode() {
  const [showQRAuthModal, setShowQRAuthModal] = useState(false);
  const showQrCode = useSelector(selectors.showQrCode);
  const qrCode = useSelector(selectors.qrCode);
  const classes = useStyles();

  const handleClose = useCallback(
    () => setShowQRAuthModal(false), [],
  );

  return (
    <>
      <div className={classes.scanCodeWrapper}>
        <div>
          {message.MFA.SCAN_QR}
        </div>
        { showQrCode
          ? <QRCode value={qrCode} size={84} className={classes.qrCode} />
          : (<OutlinedButton className={classes.qrCode} onClick={() => setShowQRAuthModal(true)}> View QR code </OutlinedButton>)}
      </div>
      {showQRAuthModal && (<ReAuthModal onClose={handleClose} isQRCode />)}
    </>
  );
}
export default function MFACodeGeneration() {
  return (
    <>
      <HeaderWithHelpText title="Add integrator.io" helpKey="mfa.addIntegrationIO">
        <Typography variant="h5" component="span">Add integrator.io</Typography>
      </HeaderWithHelpText>
      <ViewQRCode />
      <ViewSecretCode />
    </>
  );
}
