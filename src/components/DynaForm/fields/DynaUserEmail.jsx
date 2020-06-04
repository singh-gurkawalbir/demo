import React, { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormLabel, TextField } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import ChangeEmail from '../../../views/MyAccount/ChangeEmail';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import EditIcon from '../../icons/EditIcon';
import FieldHelp from '../FieldHelp';

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

function DynaUserEmail(props) {
  const classes = useStyles();
  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const dispatch = useDispatch();
  const clearComms = useCallback(() => dispatch(actions.clearComms()), [
    dispatch,
  ]);
  const handleModalOpen = useCallback(() => {
    clearComms();
    setShowChangeEmailModal(true);
  }, [clearComms]);
  const handleModalClose = useCallback(() => {
    setShowChangeEmailModal(false);
  }, []);
  const { id, value, label } = props;

  return (
    <FormControl>
      <div className={classes.formWrapper}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <FieldHelp {...props} />
      </div>
      <div className={classes.fieldWrapper}>
        <TextField
          id={id}
          type="email"
          value={value}
          disabled
          className={classes.field}
          variant="filled"
        />
        <ActionButton
          data-test="editEmail"
          color="primary"
          variant="contained"
          onClick={handleModalOpen}>
          <EditIcon />
        </ActionButton>
      </div>
      <ChangeEmail show={showChangeEmailModal} onClose={handleModalClose} />
    </FormControl>
  );
}

export default DynaUserEmail;
