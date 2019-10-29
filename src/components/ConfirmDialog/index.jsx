import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { render, unmountComponentAtNode } from 'react-dom';
import { Typography } from '@material-ui/core';

const rootElementId = 'react-confirm-dialog';

export default class ConfirmDialog extends React.Component {
  static defaultProps = {
    title: 'Confirm',
    buttons: [
      {
        label: 'No',
      },
      {
        label: 'Yes',
      },
    ],
  };
  close = () => {
    const target = document.getElementById(rootElementId);

    if (target) {
      unmountComponentAtNode(target);
      target.parentNode.removeChild(target);
    }
  };
  handleButtonClick = button => {
    this.close();

    if (button.onClick) button.onClick();
  };
  render() {
    const { title, message, buttons } = this.props;

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
              onClick={() => this.handleButtonClick(button)}>
              {button.label}
            </Button>
          ))}
        </DialogActions>
      </Dialog>
    );
  }
}

function createElementReconfirm(properties) {
  let divTarget = document.getElementById(rootElementId);

  if (!divTarget) {
    divTarget = document.createElement('div');
    divTarget.id = rootElementId;
    document.body.appendChild(divTarget);
  }

  render(<ConfirmDialog {...properties} />, divTarget);
}

export function confirmDialog(properties) {
  createElementReconfirm(properties);
}
