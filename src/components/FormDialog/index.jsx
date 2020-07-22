import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ModalDialog from '../ModalDialog';
import ButtonGroup from '../ButtonGroup';

const withStyles = makeStyles(() => ({
  contentContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '75vh',
  },
}));

export default function FormDialog(props) {
  const {
    children,
    title,
    onClose,
    onSubmit,
    cancelLabel = 'Cancel',
    submitLabel = 'Save',
    isValid = true,
  } = props;
  const classes = withStyles();

  return (
    <ModalDialog show onClose={onClose}>
      <div>{title}</div>
      <div className={classes.contentContainer}>{children}</div>
      <ButtonGroup>
        <Button
          onClick={onSubmit}
          disabled={!isValid}
          variant="outlined"
          size="small"
          color="primary">
          {submitLabel}
        </Button>
        <Button onClick={onClose} variant="text" color="primary" size="small">
          {cancelLabel}
        </Button>
      </ButtonGroup>
    </ModalDialog>
  );
}
