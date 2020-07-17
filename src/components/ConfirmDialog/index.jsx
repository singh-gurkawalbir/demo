import React, { useState, useCallback, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import ModalDialog from '../ModalDialog';
import RawHtml from '../RawHtml';
import Prompt from '../Prompt';
import ButtonsGroup from '../ButtonGroup';


const useStyles = makeStyles(theme => ({
  message: {
    marginBottom: theme.spacing(3),
    fontSize: 15,
    lineHeight: '19px',
  },
  containerButtons: {
    position: 'relative',
    width: '100%',
  },
  btnRight: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

export const ConfirmDialog = props => {
  const {
    message,
    title = 'Confirm',
    isHtml = false,
    onClose,
    maxWidth,
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
    onDialogClose,
  } = props;
  const handleButtonClick = useCallback(
    button => () => {
      onClose();
      button.onClick && button.onClick();
    },
    [onClose]
  );

  const handleClose = useCallback(() => {
    // Calls onDialogClose if passed
    if (typeof onDialogClose === 'function') {
      onDialogClose();
    }
    // Default close fn which closes the dialog
    onClose();
  }, [onClose, onDialogClose]);
  const classes = useStyles();

  return (
    <ModalDialog show onClose={handleClose} maxWidth={maxWidth}>
      {title}
      {isHtml ? (
        <RawHtml className={classes.message} html={message} />
      ) : (
        <div className={classes.message}>{message}</div>
      )}
      <div className={classes.containerButtons}>
        <ButtonsGroup>
          {buttons.map(button => (
            <Button
              variant={button.color === 'secondary' ? 'text' : 'outlined'}
              data-test={button.label}
              key={button.label}
              className={clsx({[classes.btnRight]: button.label && buttons.length > 2 === 'Cancel'})}
              color={button.color === 'secondary' ? '' : 'primary'}
              onClick={handleButtonClick(button)}>
              {button.label}
            </Button>
          ))}
        </ButtonsGroup>
      </div>

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
      {!!confirmDialogProps &&
        (confirmDialogProps.isPrompt ? (
          <Prompt {...confirmDialogProps} onClose={onClose} />
        ) : (
          <ConfirmDialog {...confirmDialogProps} onClose={onClose} />
        ))}
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
          { label: 'Cancel', variant: 'text', color: 'secondary' },
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
