import React, { useState, useCallback, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ModalDialog from '../ModalDialog';

const useStyles = makeStyles({
  message: {
    marginBottom: 10,
  },
});

export const ConfirmDialog = props => {
  const {
    message,
    title = 'Confirm',
    onClose,
    buttons = [
      {
        label: 'No',
        color: 'secondary',
      },
      {
        label: 'Yes',
        color: 'primary',
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
  const classes = useStyles();

  return (
    <ModalDialog show onClose={onClose}>
      {title}
      <div className={classes.message}>{message}</div>

      {buttons.map(button => (
        <Button
          variant={button.variant || 'outlined'}
          data-test={button.label}
          key={button.label}
          color={button.color || 'primary'}
          onClick={handleButtonClick(button)}>
          {button.label}
        </Button>
      ))}
    </ModalDialog>
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
        buttons: [
          { label: 'Yes', color: 'primary', onClick: callback },
          { label: 'Cancel', variant: 'text' },
        ],
      });
    },
    [setConfirmDialogProps]
  );

  return {
    confirmDialog: setConfirmDialogProps,
    defaultConfirmDialog,
  };
}
