import { TextField, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Fragment, useState } from 'react';

export default function Prompt(props) {
  const { title, message, buttons, label, onClose } = props;
  const [state, setState] = useState('');
  const focusOut = e => {
    setState(e.target.value);
  };

  const handleButtonClick = button => {
    onClose();

    if (button.onClick) button.onClick(state);
  };

  return (
    <Dialog open>
      <DialogTitle disableTypography>
        <Typography variant="h6">{title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Fragment>
          <DialogContentText>{message}</DialogContentText>
          <TextField
            label={label}
            onBlur={e => focusOut(e)}
            margin="normal"
            variant="outlined"
          />
        </Fragment>
      </DialogContent>
      <DialogActions>
        {buttons.map(button => (
          <Button
            data-test={button.label}
            key={button.label}
            color={button.color || 'primary'}
            onClick={() => handleButtonClick(button)}>
            {button.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}
