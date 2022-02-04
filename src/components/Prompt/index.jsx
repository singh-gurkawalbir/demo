import { makeStyles, TextField, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { useState, useCallback } from 'react';
import ModalDialog from '../ModalDialog';
import ActionGroup from '../ActionGroup';
import RawHtml from '../RawHtml';
import {FilledButton, OutlinedButton, TextButton} from '../Buttons';

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
  btnRight: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
}));

export default function Prompt(props) {
  const classes = useStyles();
  const { title, message, buttons, onClose, onDialogClose, hideClose, isHtml, allowedTags, maxWidth, className } = props;
  const [state, setState] = useState('');

  const handleClose = useCallback(() => {
    if (typeof onDialogClose === 'function') {
      onDialogClose();
    }
    // Default close fn which closes the dialog
    onClose();
  }, [onClose, onDialogClose]);
  const handleTagChange = e => {
    setState(e.target.value);
  };
  const handleButtonClick = button => {
    onClose();

    if (button.onClick) button.onClick(state);
  };

  return (
    <ModalDialog show onClose={hideClose ? undefined : handleClose} maxWidth={maxWidth}>
      {title}
      <>
        {isHtml ? (
          <RawHtml className={classes.message} html={message} options={{allowedTags}} />
        ) : (
          <Typography>{message}</Typography>
        )}
        <TextField
          autoComplete="off"
          key="integrationTag"
          data-test="integrationTag"
          name="integrationTag"
          placeholder="tag"
          value={state}
          variant="filled"
          onChange={handleTagChange}
          className={clsx(classes.formField, className)}
        />
      </>
      <ActionGroup>
        {buttons.map(button => {
          const buttonProps = {
            'data-test': button.dataTest || button.label,
            key: button.label,
            className: clsx({[classes.btnRight]: buttons.length > 2 && button.label === 'Cancel'}),
            onClick: () => handleButtonClick(button),
          };
          const {variant} = button;

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

    </ModalDialog>
  );
}
