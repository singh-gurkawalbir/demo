import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DynaForm from '../../../../components/DynaForm';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import OutlinedButton from '../../../../components/Buttons/OutlinedButton';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';

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
  return (
    <div>
      Reset MFA
    </div>
  );
}

function QRCode() {
  return (
    <div> QR code</div>
  );
}

function TrustedDevices() {
  return (
    <>
      <div> Trusted Devices </div>
      <OutlinedButton> Manage devices </OutlinedButton>
    </>
  );
}

export default function EditMFAConfiguration() {
  const classes = useStyles();
  const fieldMeta = useMemo(
    () => ({
      fieldMap: {
        secretKey: {
          id: 'secretKey',
          name: 'secretKey',
          type: 'text',
          noApi: true,
          isLoggable: false,
        },
        primaryAccount: {
          id: 'primaryAccount',
          name: 'primaryAccount',
          type: 'text',
          required: true,
          noApi: true,
          isLoggable: false,
        },
      },
    }),
    []
  );

  const formKey = useFormInitWithPermissions({ fieldMeta });
  const updateMFA = values => console.log(values);

  return (
    <>
      <div className={classes.container}>
        <ResetMFA />
        <QRCode />
        <DynaForm formKey={formKey} className={classes.ssoFormContainer} />
        <TrustedDevices />
      </div>
      <DynaSubmit
        formKey={formKey}
        className={classes.saveConfig}
        // disabled={disableSave}
        onClick={updateMFA}>
        Save
      </DynaSubmit>
    </>
  );
}
