import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import useFormInitWithPermissions from '../../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../../components/DynaForm';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
  verify: {
    position: 'relative',
    bottom: theme.spacing(2),
  },
}));

const fieldMeta = {
  fieldMap: {
    mobileCode: {
      id: 'mobileCode',
      name: 'mobileCode',
      type: 'mfamobilecode',
      label: 'Verify mobile device',
      required: true,
      validWhen: {
        matchesRegEx: {
          pattern: '^[\\d]+$',
          message: 'Numbers only',
        },
      },
      helpKey: 'mfa.code.verify',
      noApi: true,
      isLoggable: false,
    },
  },
};

export default function MobileCodeVerification() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const formKey = useFormInitWithPermissions({ fieldMeta });

  const verifyMobileCode = useCallback(values => {
    dispatch(actions.mfa.verifyMobileCode(values.mobileCode));
  }, [dispatch]);

  return (
    <>
      <DynaForm formKey={formKey} />
      <DynaSubmit formKey={formKey} onClick={verifyMobileCode} className={classes.verify}>
        Verify
      </DynaSubmit>
    </>
  );
}
