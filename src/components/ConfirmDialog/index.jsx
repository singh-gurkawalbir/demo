import React, { useState, useCallback, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import ModalDialog from '../ModalDialog';
import RawHtml from '../RawHtml';
import Prompt from '../Prompt';
import ActionGroup from '../ActionGroup';
import { TextButton, FilledButton, OutlinedButton } from '../Buttons';

const useStyles = makeStyles(theme => ({
  message: {
    fontSize: 15,
    lineHeight: '19px',
    color: theme.palette.secondary.main,
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
export const ConfirmDialog = (
  {
    message,
    title = 'Confirm',
    isHtml = false,
    allowedTags,
    onClose,
    maxWidth,
    buttons = [
      { label: 'No', variant: 'text' },
      { label: 'Yes' },
    ],
    onDialogClose,
    hideClose = false,
  }) => {
  const classes = useStyles();
  const handleButtonClick = useCallback(
    button => () => {
      if (typeof onClose === 'function') {
        onClose();
      }
      button.onClick?.();
    },
    [onClose]
  );

  const handleClose = useCallback(() => {
    if (typeof onDialogClose === 'function') {
      onDialogClose();
    }
    // Default close fn which closes the dialog
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [onClose, onDialogClose]);

  const finalHandleClose = hideClose ? undefined : handleClose;

  return (
    <ModalDialog show onClose={finalHandleClose} maxWidth={maxWidth}>
      {title}
      {isHtml ? (
        <RawHtml className={classes.message} html={message} options={{allowedTags}} />
      ) : (
        <div className={classes.message}>{message}</div>
      )}
      <div className={classes.containerButtons}>
        <ActionGroup>
          {buttons.map(button => {
            const buttonProps = {
              'data-test': button.dataTest || button.label,
              key: button.label,
              className: clsx({[classes.btnRight]: buttons.length > 2 && button.label === 'Cancel'}),
              onClick: handleButtonClick(button),
            };
            const {variant = 'filled'} = button;

            if (variant === 'filled') {
              return (
                <FilledButton {...buttonProps}>
                  {button.label}
                </FilledButton>
              );
            }
            if (variant === 'outlined') {
              return (
                <OutlinedButton {...buttonProps}>
                  {button.label}
                </OutlinedButton>
              );
            }

            if (variant === 'text') {
              return (
                <TextButton {...buttonProps}>
                  {button.label}
                </TextButton>
              );
            }

            return null;
          })}
        </ActionGroup>
      </div>

    </ModalDialog>
  );
};

const ConfirmDialogContext = React.createContext({
  setConfirmDialogProps: () => {},
});

export const ConfirmDialogProvider = ({ children }) => {
  const [confirmDialogProps, setConfirmDialogProps] = useState(null);
  const onClose = useCallback(() => setConfirmDialogProps(null), []);

  return (
    <ConfirmDialogContext.Provider
      value={{ setConfirmDialogProps }}>
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
          { label: 'Yes', onClick: callback },
          { label: 'Cancel', variant: 'text' },
        ],
      });
    },
    [setConfirmDialogProps]
  );
  const saveDiscardDialog = useCallback(
    ({onSave, onDiscard}) => {
      // console.log(({onSave, onDiscard}));
      setConfirmDialogProps({
        title: 'You’ve got unsaved changes',
        message: 'Are you sure you want to leave this page and lose your unsaved changes?',
        buttons: [
          { label: 'Save changes', onClick: onSave },
          { label: 'Discard changes', variant: 'outlined', onClick: onDiscard },
        ],
      });
    },
    [setConfirmDialogProps]
  );

  return {
    saveDiscardDialog,
    confirmDialog: setConfirmDialogProps,
    defaultConfirmDialog,
  };
}

