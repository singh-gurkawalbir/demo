import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { makeStyles } from '@material-ui/core/styles';
import DynaForm from '../../../../../components/DynaForm';
import DynaSubmit from '../../../../../components/DynaForm/DynaSubmit';
import OutlinedButton from '../../../../../components/Buttons/OutlinedButton';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import ReAuthModal from '../ReAuthModal';
import ResetAuthorizeModal from './MFAResetAuthorization';
import ManageDevicesDrawer from './ManageDevicesDrawer';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  container: {
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
  saveConfig: {
    marginLeft: theme.spacing(2),
  },
}));

function ResetMFA() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div>
      <div>Reset MFA</div>
      <OutlinedButton onClick={() => setShowAuthModal(true)}> Reset </OutlinedButton>
      {showAuthModal && (
      <ResetAuthorizeModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}

function ViewQRCode() {
  const [showQRAuthModal, setShowQRAuthModal] = useState(false);
  const showQrCode = useSelector(selectors.showQrCode);
  const qrCode = useSelector(selectors.qrCode);

  return (
    <>
      <div> QR code</div>
      { showQrCode
        ? <QRCode value={qrCode} size={64} />
        : (<OutlinedButton onClick={() => setShowQRAuthModal(true)}> View code </OutlinedButton>)}
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

function TrustedDevices() {
  const match = useRouteMatch();
  const history = useHistory();

  const handleManageDevices = useCallback(
    () => {
      history.push(buildDrawerUrl({
        path: drawerPaths.MFA.MANAGE_TRUSTED_DEVICES,
        baseUrl: match.url,
      }));
    },
    [history, match.url],
  );

  return (
    <>
      <div> Trusted Devices </div>
      <OutlinedButton onClick={handleManageDevices}> Manage devices </OutlinedButton>
      <ManageDevicesDrawer />
    </>
  );
}

export default function EditMFAConfiguration() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const primaryAccounts = useSelector(selectors.primaryAccounts);
  const isAccountOwner = useSelector(state => selectors.isAccountOwner(state));

  const primaryAccountOptions = useMemo(() => (
    [{
      items: primaryAccounts.map(
        acc => ({label: acc.ownerUser?.name, value: acc.ownerUser?._id})
      ),
    }]
  ), [primaryAccounts]);
  const fieldMeta = useMemo(
    () => {
      const metadata = {
        fieldMap: {
          secretKey: {
            id: 'secretKey',
            name: 'secretKey',
            type: 'mfasecretkey',
            noApi: true,
            isLoggable: false,
          },
        },
      };

      if (!isAccountOwner) {
        metadata.fieldMap._allowResetByUserId = {
          id: '_allowResetByUserId',
          name: '_allowResetByUserId',
          label: 'Primary account',
          type: 'select',
          noApi: true,
          isLoggable: false,
          required: true,
          options: primaryAccountOptions,
        };
      }

      return metadata;
    },
    [isAccountOwner, primaryAccountOptions]
  );

  const formKey = useFormInitWithPermissions({ fieldMeta });
  const updateMFA = values => console.log(values);

  useEffect(() => () => dispatch(actions.mfa.clear()), [dispatch]);

  return (
    <>
      <div className={classes.container}>
        <ResetMFA />
        <ViewQRCode />
        <DynaForm formKey={formKey} className={classes.ssoFormContainer} />
        <TrustedDevices />
      </div>
      <DynaSubmit
        formKey={formKey}
        className={classes.saveConfig}
        onClick={updateMFA}>
        Save
      </DynaSubmit>
    </>
  );
}
