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
    height: '158px',
  },
  content: {
    display: 'flex',
    width: '90%',
    padding: [[0, 10, 0, 10]],
    clear: 'both',
    height: theme.spacing(8),
    overflowY: 'auto',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-start',
    position: 'absolute',
    bottom: 22,
    left: 22,
  },
  warningIcon: {
    color: theme.palette.warning.main,
  },
  closeIcon: {
    float: 'right',
    padding: 0,
  },
  contentWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
    paddingLeft: theme.spacing(2),
  },
}));

function TrialExpireNotification({ content }) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <IconButton
        data-test="closeTrialNotification"
        className={classes.closeIcon}>
        <CloseIcon />
      </IconButton>
      <div className={classes.contentWrapper}>
        <WarningIcon className={classes.warningIcon} />
        <div className={classes.content}>
          <Typography variant="body2">{content}</Typography>
        </div>
      </div>
      <div className={classes.footer}>
        <ButtonsGroup>
          <Button data-test="uninstall" variant="text" color="primary">
            UNINSTALL
          </Button>
          <Button data-test="contactSales" variant="text" color="primary">
            Contact Sales
          </Button>
        </ButtonsGroup>
      </div>
      <div />
    </div>
  );
}

export default TrialExpireNotification;
