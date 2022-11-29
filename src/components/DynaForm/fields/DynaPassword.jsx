import React, { useState, useRef,useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch } from 'react-redux';
import { FormControl, FormLabel, TextField,InputAdornment } from '@material-ui/core';
import actions from '../../../actions';
import FieldHelp from '../FieldHelp';
import ActionButton from '../../ActionButton';
import ShowContentIcon from '../../icons/ShowContentIcon';
import isLoggableAttr from '../../../utils/isLoggableAttr';

const useStyles = makeStyles((theme) => ({
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
  autoSuggestDropdown: {
    position: 'absolute',
    top: 4,
    right: 0,
    marginTop: '0px !important',
    color: theme.palette.secondary.light,
    pointerEvents: 'none',
  }
  
}));

export default function DynaPassword(props) {
  const { id, label, isLoggable} = props;
  const classes = useStyles();
  const inputFieldRef = useRef();
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
    <FormControl className={classes.field}>
      <div className={classes.formWrapper}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
      </div>
      <div className={classes.fieldWrapper}>
        <TextField
          {...isLoggableAttr(isLoggable)}
          id={id}
          type="password"
          value="**********"
          disabled
          className={classes.field}
          variant="filled"
          InputProps={{
            endAdornment: (true) &&
              (
                <InputAdornment className={classes.autoSuggestDropdown} position="start">
                  <ShowContentIcon />
                </InputAdornment>
              ),
            ref: inputFieldRef,
          }}
        />
       
      </div>
    </FormControl>
  );
}
