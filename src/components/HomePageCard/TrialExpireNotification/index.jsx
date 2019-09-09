import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonsGroup from '../../ButtonGroup';
import WarningIcon from '../../icons/WarningIcon';
import CloseIcon from '../../icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  wrapper: {
    background: theme.palette.background.default,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 10,
    boxSizing: 'border-box',
    zIndex: 2,
  },
  content: {
    display: 'flex',
    width: '90%',
    padding: [[0, 10, 15, 10]],
    clear: 'both',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  warningIcon: {
    color: theme.palette.background.warning,
    marginRight: 10,
  },
  closeIcon: {
    float: 'right',
    padding: 0,
  },
}));

function TrialExpireNotification() {
  const classes = useStyles();
  const number = 25;

  return (
    <div className={classes.wrapper}>
      <IconButton className={classes.closeIcon}>
        <CloseIcon />
      </IconButton>
      <div className={classes.content}>
        <WarningIcon className={classes.warningIcon} />
        <Typography variant="body2">
          Your free trials expires in {number} days
        </Typography>
      </div>
      <ButtonsGroup>
        <Button variant="text" color="primary">
          UNINSTALL
        </Button>
        <Button variant="text" color="primary">
          Contact Sales
        </Button>
      </ButtonsGroup>
      <div />
    </div>
  );
}

export default TrialExpireNotification;
