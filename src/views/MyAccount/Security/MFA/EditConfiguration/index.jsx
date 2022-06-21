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
import HeaderWithHelpText from '../HeaderWithHelpText';
import ResetAuthorizeModal from './MFAResetAuthorization';
import ManageDevicesDrawer from './ManageDevicesDrawer';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  container: {
    borderLeft: `3px solid ${theme.palette.secondary.lightest}`,
    marginBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
  },
  actions: {
    marginBottom: theme.spacing(2),
  },
}));

function ResetMFA() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div>
      <HeaderWithHelpText helpKey="mfa.reset"><span>Reset MFA</span></HeaderWithHelpText>
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
      <HeaderWithHelpText helpKey="mfa.qrcode"><span>QR code</span></HeaderWithHelpText>
      { showQrCode
        ? <QRCode value={qrCode} size={64} />
        : (<OutlinedButton onClick={() => setShowQRAuthModal(true)}> View code </OutlinedButton>)}
      {showQRAuthModal && (
      <ReAuthModal onClose={() => setShowQRAuthModal(false)} isQRCode />
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
      <HeaderWithHelpText helpKey="mfa.trustedDevices"><span>Trusted devices </span></HeaderWithHelpText>
      <OutlinedButton onClick={handleManageDevices}> Manage devices </OutlinedButton>
      <ManageDevicesDrawer />
    </>
  );
}

export default function EditMFAConfiguration() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [remountKey, setRemountKey] = useState(1);
  const primaryAccounts = useSelector(selectors.primaryAccounts);
  const selectedPrimaryAccount = useSelector(selectors.selectedPrimaryAccount);
  const mfaUserSettings = useSelector(selectors.mfaUserSettings);
  const isAccountOwner = useSelector(state => selectors.isAccountOwner(state));
  const areUserSettingsLoaded = useSelector(selectors.areUserSettingsLoaded);

  const primaryAccountOptions = useMemo(() => (
    [{
      items: primaryAccounts.map(
        acc => ({label: acc.ownerUser?.name, value: acc.ownerUser?._id})
      ),
    }]
  ), [primaryAccounts]);

  useEffect(() => {
    setRemountKey(remountKey => remountKey + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areUserSettingsLoaded]);

  const fieldMeta = useMemo(
    () => {
      const metadata = {
        fieldMap: {
          secretKey: {
            id: 'secretKey',
            name: 'secretKey',
            type: 'mfasecretkey',
            label: 'Secret key',
            helpKey: 'mfa.viewSecret',
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
          defaultValue: selectedPrimaryAccount,
          noApi: true,
          isLoggable: false,
          required: true,
          options: primaryAccountOptions,
        };
      }

      return metadata;
    },
    [isAccountOwner, primaryAccountOptions, selectedPrimaryAccount]
  );

  const formKey = useFormInitWithPermissions({ fieldMeta, remountKey });
  const updateMFA = useCallback(values => {
    const { _allowResetByUserId } = values;

    dispatch(actions.mfa.setUp({ ...mfaUserSettings, _allowResetByUserId}));
  }, [dispatch, mfaUserSettings]);

  useEffect(() => () => dispatch(actions.mfa.clear()), [dispatch]);

  return (
    <>
      <div className={classes.container}>
        <div className={classes.actions}>
          <ResetMFA />
        </div>
        <div className={classes.actions}>
          <ViewQRCode />
        </div>
        <DynaForm formKey={formKey} className={classes.ssoFormContainer} />
        <div className={classes.actions}>
          <TrustedDevices />
        </div>
      </div>
      {!isAccountOwner ? (
        <DynaSubmit
          formKey={formKey}
          onClick={updateMFA}>
          Save
        </DynaSubmit>
      ) : null }
    </>
  );
}
