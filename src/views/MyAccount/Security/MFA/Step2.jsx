import React, {useState, useCallback} from 'react';
import { useSelector } from 'react-redux';
import QRCode from 'react-qr-code';
import ReAuthModal from './ReAuthModal';
import OutlinedButton from '../../../../components/Buttons/OutlinedButton';
import { selectors } from '../../../../reducers';

function ViewSecretCode() {
  const [showSecretCodeAuthModal, setShowSecretCodeAuthModal] = useState(false);
  const handleClose = useCallback(
    () => setShowSecretCodeAuthModal(false), [],
  );
  const showSecretCode = useSelector(selectors.showSecretCode);
  const secretCode = useSelector(selectors.secretCode);

  console.log(secretCode);

  return (
    <>
      <div> Can’t scan your QR code? Enter the following code and URL in your verification app: </div>
      { showSecretCode
        ? `${JSON.stringify(secretCode)}`
        : (<OutlinedButton onClick={() => setShowSecretCodeAuthModal(true)}> View Secret code </OutlinedButton>)}
      {showSecretCodeAuthModal && (
      <ReAuthModal
        title="Re-authenticate your account"
        onClose={handleClose} />
      )}
    </>
  );
}

function ViewQRCode() {
  const [showQRAuthModal, setShowQRAuthModal] = useState(false);
  const showQrCode = useSelector(selectors.showQrCode);
  const qrCode = useSelector(selectors.qrCode);

  return (
    <>
      <div> Scan the QR code below with your verification app. Once your app reads the QR code, you&apos;ll get a 6-digit code. </div>
      { showQrCode
        ? <QRCode value={qrCode} size={64} />
        : (<OutlinedButton onClick={() => setShowQRAuthModal(true)}> View QR code </OutlinedButton>)}
      {showQRAuthModal && (
      <ReAuthModal
        title="Re-authenticate your account"
        onClose={() => setShowQRAuthModal(false)}
        isQRCode
         />
      )}
    </>
  );
}
export default function Step2() {
  return (
    <>
      <div> Add integrator.io</div>
      <ViewQRCode />
      <ViewSecretCode />
    </>
  );
}
