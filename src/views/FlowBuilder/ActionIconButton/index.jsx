import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Tooltip } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  button: {
    transition: theme.transitions.create(['left', 'top'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  iconButtonRoot: {
    border: '1px solid',
    padding: theme.spacing(0.5),
    marginRight: theme.spacing(1),
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& svg': {
        color: theme.palette.common.white,
      },
    },
  },
  iconButtonLabel: {
    '& svg': {
      width: 26,
      height: 26,
    },
  },
}));

export default function ActionIconButton({
  helpText,
  className,
  children,
  ...props
}) {
  const classes = useStyles();

  return (
    <Tooltip title={helpText}>
      <IconButton
        size="small"
        className={clsx(classes.button, className)}
        classes={{
          root: classes.iconButtonRoot,
          label: classes.iconButtonLabel,
        }}
        {...props}>
        {children}
      </IconButton>
    </Tooltip>
  );
}
