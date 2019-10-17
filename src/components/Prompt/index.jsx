import { Fragment, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { render, unmountComponentAtNode } from 'react-dom';
import { Typography, TextField } from '@material-ui/core';

const rootElementId = 'react-confirm-dialog';

export default function Prompt(props) {
  const { title, message, buttons, label } = props;
  const [state, setState] = useState('');
  const close = () => {
    const target = document.getElementById(rootElementId);

    if (target) {
      unmountComponentAtNode(target);
      target.parentNode.removeChild(target);
    }
  };

  const focusOut = e => {
    setState(e.target.value);
  };

  const handleButtonClick = button => {
    close();

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

function createElementReconfirm(properties) {
  let divTarget = document.getElementById(rootElementId);

  if (!divTarget) {
    divTarget = document.createElement('div');
    divTarget.id = rootElementId;
    document.body.appendChild(divTarget);
  }

  render(<Prompt {...properties} />, divTarget);
}

export function prompt(props) {
  createElementReconfirm(props);
}
