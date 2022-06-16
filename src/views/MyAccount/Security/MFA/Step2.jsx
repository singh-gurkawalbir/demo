import React, {useState, useCallback} from 'react';
import ReAuthModal from './ReAuthModal';
import OutlinedButton from '../../../../components/Buttons/OutlinedButton';

function SecretCode() {
  const [showSecretCodeAuthModal, setShowSecretCodeAuthModal] = useState(false);
  const handleClose = useCallback(
    () => {
      setShowSecretCodeAuthModal(false);
    },
    [],
  );

  return (
    <>
      <OutlinedButton onClick={() => setShowSecretCodeAuthModal(true)}> View Secret code </OutlinedButton>
      {showSecretCodeAuthModal && <ReAuthModal title="Re-authenticate your account" onClose={handleClose} /> }
      <div> Can’t scan your QR code? Enter the following code and URL in your verification app: </div>
      <div> Secret code </div>
    </>
  );
}

function QRCode() {
  const [showQRAuthModal, setShowQRAuthModal] = useState(false);

  return (
    <>
      <div> Scan the QR code below with your verification app. Once your app reads the QR code, you&apos;ll get a 6-digit code. </div>
      <OutlinedButton onClick={() => setShowQRAuthModal(true)}> View QR code </OutlinedButton>
      <div> QR code </div>
      {showQRAuthModal && <ReAuthModal title="Re-authenticate your account" onClose={() => setShowQRAuthModal(false)} /> }
    </>
  );
}
export default function Step2() {
  return (
    <>
      <div> Add integrator.io</div>
      <QRCode />
      <SecretCode />
    </>
  );
}
