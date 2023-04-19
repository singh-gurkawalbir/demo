import React, { useState, useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import { FormControl, FormLabel, TextField } from '@mui/material';
import { selectors } from '../../../../reducers';
import FieldHelp from '../../FieldHelp';
import ActionButton from '../../../ActionButton';
import ShowContentIcon from '../../../icons/ShowContentIcon';
import HideContentIcon from '../../../icons/HideContentIcon';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import ReAuthModal from '../../../../views/MyAccount/Security/MFA/ReAuthModal';

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
}));

function HiddenSecretKey({ id, isLoggable, setShowSecretKey }) {
  const classes = useStyles();
  const [showSecretCodeAuthModal, setShowSecretCodeAuthModal] = useState(false);
  const showMFASecretCode = useSelector(selectors.showSecretCode);

  const handleShowSecretKey = useCallback(() => {
    if (showMFASecretCode) return setShowSecretKey(true);
    setShowSecretCodeAuthModal(true);
  }, [showMFASecretCode, setShowSecretKey]);

  const handleClose = useCallback(
    () => {
      setShowSecretCodeAuthModal(false);
      if (showMFASecretCode) {
        setShowSecretKey(true);
      }
    }, [setShowSecretKey, showMFASecretCode],
  );

  return (
    <div className={classes.fieldWrapper}>
      <TextField
        {...isLoggableAttr(isLoggable)}
        id={id}
        type="text"
        value="xxxxxxxxx"
        disabled
        className={classes.field}
        variant="filled"
        />
      <ActionButton
        data-test="showSecretKey"
        color="primary"
        variant="contained"
        tooltip="View secret key"
        placement="bottom"
        onClick={handleShowSecretKey}>
        <ShowContentIcon />
      </ActionButton>
      {showSecretCodeAuthModal && (
      <ReAuthModal onClose={handleClose} />
      )}
    </div>
  );
}
function VisibleSecretKey({ id, isLoggable, setShowSecretKey }) {
  const classes = useStyles();
  const secretKey = useSelector(selectors.secretCode);

  return (
    <div className={classes.fieldWrapper}>
      <TextField
        {...isLoggableAttr(isLoggable)}
        id={id}
        value={secretKey}
        disabled
        className={classes.field}
        variant="filled" />
      <ActionButton
        data-test="hideSecretKey"
        color="primary"
        variant="contained"
        tooltip="Hide secret key"
        placement="bottom"
        onClick={() => setShowSecretKey(false)}>
        <HideContentIcon />
      </ActionButton>
    </div>
  );
}

export default function DynaMFASecretKey(props) {
  const { id, label, isLoggable} = props;
  const classes = useStyles();
  const showMFASecretCode = useSelector(selectors.showSecretCode);
  const [showSecretKey, setShowSecretKey] = useState(false);

  return (
    <FormControl variant="standard" className={classes.field}>
      <div className={classes.formWrapper}>
        <FormLabel htmlFor={id}>{label}</FormLabel>
        <FieldHelp {...props} />
      </div>
      { (showMFASecretCode && showSecretKey)
        ? <VisibleSecretKey id={id} isLoggable={isLoggable} setShowSecretKey={setShowSecretKey} />
        : <HiddenSecretKey id={id} setShowSecretKey={setShowSecretKey} /> }
    </FormControl>
  );
}
