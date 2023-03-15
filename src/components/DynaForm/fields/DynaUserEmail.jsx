import React, { useState, useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { FormControl, FormLabel, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import ChangeEmail from '../../../views/MyAccount/ChangeEmail';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import EditIcon from '../../icons/EditIcon';
import FieldHelp from '../FieldHelp';
import isLoggableAttr from '../../../utils/isLoggableAttr';

const useStyles = makeStyles({
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
});

export default function DynaUserEmail(props) {
  const classes = useStyles();
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const dispatch = useDispatch();
  const clearComms = useCallback(() => dispatch(actions.api.clearComms()), [
    dispatch,
  ]);
  const handleModalOpen = useCallback(() => {
    clearComms();
    setShowChangeEmailModal(true);
  }, [clearComms]);
  const handleModalClose = useCallback(() => {
    setShowChangeEmailModal(false);
  }, []);
  const { id, value, label, readOnly = false, isLoggable } = props;

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
          type="email"
          value={value}
          disabled
          className={classes.field}
          variant="filled"
        />
        {!readOnly && (
        <ActionButton
          data-test="editEmail"
          color="primary"
          variant="contained"
          onClick={handleModalOpen}>
          <EditIcon />
        </ActionButton>
        )}
      </div>
      <ChangeEmail show={showChangeEmailModal} onClose={handleModalClose} />
    </FormControl>
  );
}
