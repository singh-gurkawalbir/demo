import React, {useState, useCallback} from 'react';
import { useSelector } from 'react-redux';
import QRCode from 'react-qr-code';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ReAuthModal from './ReAuthModal';
import HeaderWithHelpText from './HeaderWithHelpText';
import OutlinedButton from '../../../../components/Buttons/OutlinedButton';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  scanQrCodeWrapper: {
    marginBottom: theme.spacing(2),
  },
  qrCodeValue: {
    border: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(2, 3),
    margin: theme.spacing(1, 0),
    borderRadius: theme.spacing(1),
    display: 'inline-flex',
    flexDirection: 'column',
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
      <div className={classes.scanQrCodeWrapper}>
        <Typography variant="body2">Can’t scan your QR code? Enter the following code and URL in your verification app:</Typography>
        <div>
          <div className={classes.qrCodeValue}>
            <Typography variant="body2">Code: XXX-XXX-XXX</Typography>
            <Typography variant="body2">URL: https://integrator.io</Typography>
          </div>
        </div>
        { showSecretCode
          ? `${JSON.stringify(secretCode)}`
          : (<OutlinedButton onClick={() => setShowSecretCodeAuthModal(true)}> View Secret code </OutlinedButton>)}
      </div>
      {showSecretCodeAuthModal && (
      <ReAuthModal onClose={handleClose} />
      )}
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
      <div className={classes.scanQrCodeWrapper}>
        <Typography variant="body2">
          Scan the QR code below with your verification app. Once your app reads the QR code, you&apos;ll get a 6-digit code.
        </Typography>
        { showQrCode
          ? <QRCode value={qrCode} size={64} />
          : (<OutlinedButton onClick={() => setShowQRAuthModal(true)}> View QR code </OutlinedButton>)}
      </div>
      {showQRAuthModal && (
      <ReAuthModal onClose={handleClose} isQRCode />
      )}
    </>
  );
}
export default function MFACodeGeneration() {
  return (
    <>
      <HeaderWithHelpText title="Step 2" helpKey="step2">
        <span> Add integrator.io</span>
      </HeaderWithHelpText>
      <ViewQRCode />
      <ViewSecretCode />
    </>
  );
}
