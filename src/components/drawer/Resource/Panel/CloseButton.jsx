import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { useSelector } from 'react-redux';
import Close from '../../../icons/CloseIcon';
import { selectors } from '../../../../reducers';
import { FORM_SAVE_STATUS } from '../../../../utils/constants';

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.dark,
    },
  },
}));

export default function CloseButton({onClose,
  resourceType,
  resourceId,
}) {
  const classes = useStyles();
  const status = useSelector(state =>
    selectors.asyncTaskStatus(state, `${resourceType}-${resourceId}`));

  const disabled = status === FORM_SAVE_STATUS.LOADING;

  return (
    <IconButton
      data-test="closeDrawer"
      className={classes.closeButton}
      disabled={disabled}
      onClick={onClose}>
      <Close />
    </IconButton>
  );
}
