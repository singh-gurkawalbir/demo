import React, { useState, useCallback, useContext } from 'react';
import { TextField } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { TextButton, FilledButton, OutlinedButton } from '@celigo/fuse-ui';
import ModalDialog from '../ModalDialog';
import RawHtml from '../RawHtml';
import ActionGroup from '../ActionGroup';
import { DISCARD_DIALOG_TITLE, DISCARD_DIALOG_MESSAGE } from '../../constants';

const useStyles = makeStyles(theme => ({
  message: {
    fontSize: 15,
    lineHeight: '19px',
    color: theme.palette.secondary.main,
  },
  formField: {
    paddingTop: theme.spacing(1),
    width: '100%',
    marginTop: theme.spacing(1),
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
const ConfirmDialog = (
  {
    message,
    title = 'Confirm',
    isHtml = false,
    allowedTags,
    onClose,
    maxWidth,
    isPrompt = false,
    buttons = [
      { label: 'No', variant: 'text' },
      { label: 'Yes' },
    ],
    onDialogClose,
    hideClose = false,
  }) => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const handleButtonClick = useCallback(
    button => () => {
      onClose();
      button.onClick?.(isPrompt ? inputValue : undefined);
    },
    [onClose, isPrompt, inputValue]
  );

  const handleTagChange = e => {
    setInputValue(e.target.value);
  };
  const handleClose = useCallback(() => {
    if (typeof onDialogClose === 'function') {
      onDialogClose();
    }
    // Default close fn which closes the dialog
    onClose();
  }, [onClose, onDialogClose]);

  return (
    <ModalDialog show onClose={hideClose ? undefined : handleClose} maxWidth={maxWidth}>
      {title}
      <>
        {isHtml ? (
          <RawHtml className={classes.message} html={message} options={{allowedTags}} />
        ) : (
          <div className={classes.message}>{message}</div>
        )}
        {isPrompt && (
        <TextField
          autoComplete="off"
          key="integrationTag"
          data-test="integrationTag"
          name="integrationTag"
          placeholder="tag"
          value={inputValue}
          variant="filled"
          onChange={handleTagChange}
          className={classes.formField}
        />
        )}
      </>
      <div className={classes.containerButtons}>
        <ActionGroup>
          {buttons.map(button => {
            const buttonProps = {
              'data-test': button.dataTest || button.label,
              key: button.label,
              error: button.error,
              sx: (buttons.length > 2 && button.label === 'Cancel') ? ({
                position: 'absolute',
                right: 0,
                top: 0,
              }) : {},
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
      {!!confirmDialogProps && <ConfirmDialog {...confirmDialogProps} onClose={onClose} />}
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
      setConfirmDialogProps({
        title: DISCARD_DIALOG_TITLE,
        message: DISCARD_DIALOG_MESSAGE,
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

