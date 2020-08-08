import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import clsx from 'clsx';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, Typography } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    display: 'flex',
    margin: theme.spacing(0, 2),
    padding: theme.spacing(2, 0, 1, 0),

  },
  actionButton: {
    float: 'right',
    textTransform: 'inherit',
  },
  titleText: {
    maxWidth: '95%',
    flex: 1,
    wordBreak: 'break-word',
    '& > .MuiTypography-root': {
      color: theme.palette.secondary.main,
    },
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1) + 4,
    right: theme.spacing(2) + 2,
    padding: theme.spacing(1) - 3,
  },
  actions: {
    justifyContent: 'flex-start',
    padding: theme.spacing(2, 0),
    borderTop: `1px solid ${theme.palette.secondary.lightest} `,
    margin: theme.spacing(0, 2),
  },
  paper: {
    minWidth: '450px',
    borderRadius: 0,
  },
  sm: {
    minWidth: theme.breakpoints.values.sm,
  },
  md: {
    minWidth: theme.breakpoints.values.md,
  },
  dialogContent: {
    background: theme.palette.common.white,
    padding: theme.spacing(2),
  },
}));

export default function ModalDialog({
  show,
  onClose,
  actionLabel,
  actionHandler,
  maxWidth,
  minWidth,
  fullScreen,
  children,
}) {
  const classes = useStyles();

  return (
    <Dialog
      open={show}
      maxWidth={maxWidth}
      fullScreen={fullScreen}
      PaperProps={{ className: classes.paper }}>
      {children[0] && (
        <DialogTitle
          className={clsx(classes.dialogTitle, classes[minWidth])}
          disableTypography>
          <Typography variant="h3" component="div" className={classes.titleText}>
            {children[0]}
          </Typography>
          {onClose && (
            <IconButton
              onClick={onClose}
              className={classes.closeButton}
              autoFocus>
              <CloseIcon />
            </IconButton>
          )}
          {!onClose && actionHandler && (
            <Button
              variant="outlined"
              color="secondary"
              className={classes.actionButton}
              onClick={actionHandler}
              data-test={actionLabel}>
              {actionLabel}
            </Button>
          )}
        </DialogTitle>
      )}
      {children[1] && <DialogContent className={classes.dialogContent}>{children[1]}</DialogContent>}
      {children[2] && (
        <DialogActions className={classes.actions}>{children[2]}</DialogActions>
      )}
    </Dialog>
  );
}
