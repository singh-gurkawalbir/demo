import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import ChevronDownIcon from 'mdi-react/ChevronDownIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import ErrorBox from './ErrorBox';

const styles = theme => ({
  panel: {
    marginBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1, 3),
    display: 'flex',
    justifyContent: 'space-between',
    color: 'white',
  },
  pad: {
    paddingTop: 9,
    paddingBottom: 9,
  },
  error: {
    backgroundColor: theme.palette.background.error,
    color: 'white',
  },
  disabled: {
    opacity: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  icon: {
    color: 'white',
  },
});

/**
 * Render an error in a panel. Will be expandable display stack traces
 * when in development
 */
function ErrorPanel(props) {
  const { classes, error, onClose } = props;
  const showStack =
    process.env.NODE_ENV === 'development' && error instanceof Error;

  if (!showStack) {
    return (
      <Paper
        className={classNames(classes.panel, classes.paper, classes.error)}>
        {typeof error === 'string' ? error : error.message}
        {onClose && (
          <IconButton onClick={onClose} className={classes.icon}>
            <CloseIcon />
          </IconButton>
        )}
      </Paper>
    );
  }

  return (
    <ExpansionPanel
      className={classNames(classes.panel, classes.error)}
      disabled={!showStack}>
      <ExpansionPanelSummary
        classes={{ disabled: classes.disabled }}
        expandIcon={<ChevronDownIcon className={classes.icon} />}>
        {typeof error === 'string' ? error : error.message}
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <ErrorBox error={error} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default withStyles(styles)(ErrorPanel);
