import { Component } from 'react';
import { func, instanceOf, oneOfType, string } from 'prop-types';
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

@withStyles(theme => ({
  panel: {
    marginBottom: theme.spacing.triple,
  },
  paper: {
    padding: `0 ${theme.spacing.double}px`,
    display: 'flex',
    justifyContent: 'space-between',
  },
  pad: {
    paddingTop: 9,
    paddingBottom: 9,
  },
  error: {
    backgroundColor: theme.palette.error.dark,
    borderColor: theme.palette.error.light,
  },
  errorText: {
    color: theme.palette.error.contrastText,
  },
  disabled: {
    opacity: 1,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))
/**
 * Render an error in a panel. Will be expandable display stack traces
 * when in development
 */
export default class ErrorPanel extends Component {
  static propTypes = {
    /**
     * Error to display
     */
    error: oneOfType([string, instanceOf(Error)]).isRequired,
    /**
     * Execute a function to make the panel controlled-closeable.
     */
    onClose: func,
  };

  render() {
    const { classes, error, onClose } = this.props;
    const showStack =
      process.env.NODE_ENV === 'development' && error instanceof Error;

    if (!showStack) {
      return (
        <Paper
          className={classNames(classes.panel, classes.paper, classes.error)}>
          {typeof error === 'string' ? error : error.message}
          {onClose && (
            <IconButton onClick={onClose}>
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
          expandIcon={<ChevronDownIcon />}>
          {typeof error === 'string' ? error : error.message}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <ErrorBox error={error} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}
