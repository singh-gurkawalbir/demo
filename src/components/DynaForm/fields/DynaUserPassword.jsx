import React, { useState, useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch } from 'react-redux';
import { FormControl, FormLabel, TextField } from '@mui/material';
import clsx from 'clsx';
import ChangePassword from '../../../views/MyAccount/ChangePassword';
import actions from '../../../actions';
import FieldHelp from '../FieldHelp';
import ActionButton from '../../ActionButton';
import EditIcon from '../../icons/EditIcon';
import isLoggableAttr from '../../../utils/isLoggableAttr';

const useStyles = makeStyles(() => ({
  formWrapper: {
    alignItems: 'flex-start',
    display: 'flex',
  },

  fieldWrapper: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  field: {
    width: '100%',
  },
  dynaPasswordTextField: {
    '& * >.MuiFilledInput-input': {
      letterSpacing: '2px',
      '&::placeholder': {
        letterSpacing: '1px',
      },
    },
  },
}));

export default function DynaUserPassword(props) {
  const { id, label, isLoggable} = props;
  const classes = useStyles();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const dispatch = useDispatch();
  const clearComms = useCallback(() => dispatch(actions.api.clearComms()), [
    dispatch,
  ]);
  const handleModalOpen = useCallback(() => {
    clearComms();
    setShowPasswordModal(true);
  }, [clearComms]);
  const handleModalClose = useCallback(() => {
    setShowPasswordModal(false);
  }, []);

  return (
    <FormControl variant="standard" className={classes.field}>
      <div className={classes.formWrapper}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <FieldHelp {...props} />
      </div>
      <div className={classes.fieldWrapper}>
        <TextField
          {...isLoggableAttr(isLoggable)}
          id={id}
          type="password"
          value="**********"
          disabled
          className={clsx(classes.field, classes.dynaPasswordTextField)}
          variant="filled"
        />
        <ActionButton
          data-test="editPassword"
          color="primary"
          variant="contained"
          onClick={handleModalOpen}>
          <EditIcon />
        </ActionButton>
      </div>
      <ChangePassword show={showPasswordModal} onClose={handleModalClose} />
    </FormControl>
  );
}
