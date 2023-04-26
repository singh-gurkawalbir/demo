import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch } from 'react-redux';
import DynaSubmit from '../../../../components/DynaForm/DynaSubmit';
import useForm from '../../../../components/Form';
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
      maxLength: 6,
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

export default function MobileCodeVerification({className}) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const formKey = useForm({ fieldMeta });

  const verifyMobileCode = useCallback(values => {
    dispatch(actions.mfa.verifyMobileCode(values.mobileCode));
  }, [dispatch]);

  return (
    <>
      <DynaForm formKey={formKey} className={className} />
      <DynaSubmit formKey={formKey} onClick={verifyMobileCode} className={classes.verify}>
        Verify
      </DynaSubmit>
    </>
  );
}
