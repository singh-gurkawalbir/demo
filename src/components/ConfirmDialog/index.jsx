import React, { useState, useCallback, useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import ModalDialog from '../ModalDialog';
import RawHtml from '../RawHtml';
import Prompt from '../Prompt';
import ActionGroup from '../ActionGroup';

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

const getButtonProps = ({ variant, color }) => {
  const buttonVariantProps = {
    primary: {
      color: 'primary',
      variant: 'outlined',
    },
    secondary: {
      color: 'secondary',
      variant: 'outlined',
    },
    tertiary: {
      variant: 'text',
    },
  };

  let buttonProps;

  if (variant) {
    buttonProps = buttonVariantProps[variant];
  } else {
    // NOTE: This "else" block should be deleted when we update
    // all instances of this component to use the new variant prop.
    buttonProps = {
      variant: color === 'secondary' ? 'text' : 'outlined',
      color: color === 'secondary' ? '' : 'primary',
    };
  }

  return buttonProps;
};

export const ConfirmDialog = (
  {
    message,
    title = 'Confirm',
    isHtml = false,
    allowedTags,
    onClose,
    maxWidth,
    buttons = [
      { label: 'No', variant: 'secondary' },
      { label: 'Yes', variant: 'primary' },
    ],
    onDialogClose,
  }) => {
  const classes = useStyles();
  const handleButtonClick = useCallback(
    button => () => {
      onClose();
      button.onClick?.();
    },
    [onClose]
  );

  const handleClose = useCallback(() => {
    if (typeof onDialogClose === 'function') {
      onDialogClose();
    }
    // Default close fn which closes the dialog
    onClose();
  }, [onClose, onDialogClose]);

  return (
    <ModalDialog show onClose={handleClose} maxWidth={maxWidth}>
      {title}
      {isHtml ? (
        <RawHtml className={classes.message} html={message} options={{allowedTags}} />
      ) : (
        <div className={classes.message}>{message}</div>
      )}
      <div className={classes.containerButtons}>
        <ActionGroup>
          {buttons.map(button => (
            <Button
              data-test={button.dataTest || button.label}
              key={button.label}
              className={clsx({[classes.btnRight]: buttons.length > 2 && button.label === 'Cancel'})}
              onClick={handleButtonClick(button)}
              {...getButtonProps(button)}>
              {button.label}
            </Button>
          ))}
        </ActionGroup>
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
          { label: 'Yes', color: 'primary', onClick: callback },
          { label: 'Cancel', variant: 'text', color: 'secondary' },
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
          { label: 'Save Changes', variant: 'primary', onClick: onSave },
          { label: 'Discard Changes', variant: 'secondary', onClick: onDiscard },
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
