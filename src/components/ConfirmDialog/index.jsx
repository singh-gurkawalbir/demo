import React, { useState, useCallback, useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';

export const ConfirmDialog = props => {
  const {
    message,
    title = 'Confirm',
    onClose,
    buttons = [
      {
        label: 'No',
      },
      {
        label: 'Yes',
      },
    ],
  } = props;
  const handleButtonClick = useCallback(
    button => () => {
      onClose();

      button.onClick && button.onClick();
    },
    [onClose]
  );

  return (
    <Dialog open>
      <DialogTitle disableTypography>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {buttons.map(button => (
          <Button
            data-test={button.label}
            key={button.label}
            color={button.color || 'primary'}
            onClick={handleButtonClick(button)}>
            {button.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};

export const ConfirmDialogContext = React.createContext({
  setConfirmDialogProps: () => {},
});

export const ConfirmDialogProvider = ({ children }) => {
  const [confirmDialogProps, setConfirmDialogProps] = useState(null);
  const onClose = useCallback(() => setConfirmDialogProps(null), []);

  return (
    <ConfirmDialogContext.Provider
      value={{
        setConfirmDialogProps,
      }}>
      {!!confirmDialogProps && (
        <ConfirmDialog {...confirmDialogProps} onClose={onClose} />
      )}
      {children}
    </ConfirmDialogContext.Provider>
  );
};

export default function useConfirmDialog() {
  const { setConfirmDialogProps } = useContext(ConfirmDialogContext);
  const defaultConfirmDialog = useCallback(
    (message, callback) => {
      setConfirmDialogProps({
        title: 'Confirm',
        message: `Are you sure you want to ${message}`,
        buttons: [{ label: 'Cancel' }, { label: 'Yes', onClick: callback }],
      });
    },
    [setConfirmDialogProps]
  );

  return {
    confirmDialog: setConfirmDialogProps,
    defaultConfirmDialog,
  };
}
