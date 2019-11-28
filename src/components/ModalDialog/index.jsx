import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { Button, Typography } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '../icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  actionButton: {
    float: 'right',
    textTransform: 'inherit',
  },
  titleText: {
    maxWidth: '95%',
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1) + 4,
    right: theme.spacing(2) + 2,
    padding: theme.spacing(1) - 3,
  },
  actions: {
    justifyContent: 'flex-start',
    padding: theme.spacing(1, 3),
    borderTop: `1px solid ${theme.palette.secondary.lightest} `,
  },
  paper: {
    minWidth: '450px',
  },
  sm: {
    minWidth: theme.breakpoints.values.sm,
  },
  md: {
    minWidth: theme.breakpoints.values.md,
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
    <div>
      <Dialog
        open={show}
        maxWidth={maxWidth}
        fullScreen={fullScreen}
        PaperProps={{ className: classes.paper }}>
        {children[0] && (
          <DialogTitle className={classes[minWidth]} disableTypography>
            <Typography variant="h3" className={classes.titleText}>
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
              <Button className={classes.actionButton} onClick={actionHandler}>
                {actionLabel}
              </Button>
            )}
          </DialogTitle>
        )}
        {children[1] && <DialogContent>{children[1]}</DialogContent>}
        {children[2] && (
          <DialogActions className={classes.actions}>
            {children[2]}
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
