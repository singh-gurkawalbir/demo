import React from 'react';
import Dialog from '@mui/material/Dialog';
import clsx from 'clsx';
import DialogActions from '@mui/material/DialogActions';
import { Typography } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import makeStyles from '@mui/styles/makeStyles';
import { OutlinedButton } from '@celigo/fuse-ui';
import CloseIcon from '../icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  dialogTitle: {
    display: 'flex',
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(2),
  },
  titleText: {
    maxWidth: `calc(100% - ${theme.spacing(4)})`,
    flex: 1,
    wordBreak: 'break-word',
    '& > .MuiTypography-root': {
      color: theme.palette.secondary.main,
    },
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(2),
    padding: theme.spacing(1),
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
    background: theme.palette.background.paper,
    padding: theme.spacing(2),
    wordBreak: 'break-word',
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
  className,
  disableEnforceFocus,
  disableClose,
}) {
  const classes = useStyles();

  return (
    <Dialog
      disableEnforceFocus={disableEnforceFocus}
      open={show}
      maxWidth={maxWidth}
      fullScreen={fullScreen}
      PaperProps={{ className: classes.paper }}>
      {children[0] && (
        <DialogTitle className={clsx(classes.dialogTitle, classes[minWidth])}>
          <Typography variant="h3" component="div" className={classes.titleText}>
            {children[0]}
          </Typography>
          {onClose && (
            <IconButton
              onClick={onClose}
              className={classes.closeButton}
              disabled={disableClose}
              autoFocus
              size="large">
              <CloseIcon data-testid="closeModalDialog" />
            </IconButton>
          )}
          {!onClose && actionHandler && (
            <OutlinedButton
              sx={{
                float: 'right',
                textTransform: 'inherit',
              }}
              onClick={actionHandler}
              data-test={actionLabel}>
              {actionLabel}
            </OutlinedButton>
          )}
        </DialogTitle>
      )}
      {children[1] && <DialogContent className={clsx(classes.dialogContent, className)}>{children[1]}</DialogContent>}
      {children[2] && (
        <DialogActions className={classes.actions}>{children[2]}</DialogActions>
      )}
    </Dialog>
  );
}
