import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
// import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TimeAgo from 'react-timeago';
import Spinner from '../../components/Spinner';
import ErrorPanel from '../../components/ErrorPanel';
import api from '../../utils/api';

@hot(module)
@withStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '66.66%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }),
}))
export default class Exports extends Component {
  state = {
    loading: false,
    rowData: [],
    expanded: null,
  };

  async componentDidMount() {
    this.setState({ loading: true });

    try {
      this.setState({
        // exports: await api('/exports'),
        rowData: await this.fetchRowData(),
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        rowData: null,
        loading: false,
        error,
      });
    }
  }

  async fetchRowData() {
    const exports = await api('/exports');
    const connections = await api('/connections');
    const connHash = {};

    // convert conn array to hash keyed from conn id.
    // lets join exports and connection into hybrid obj.
    connections.map(c => (connHash[c._id] = c));

    const rowData = exports.map(e => ({
      id: e._id,
      name: e.name || e._id,
      type: e.type,
      lastModified: e.lastModified,
      connection: {
        type: connHash[e._connectionId].type,
        id: connHash[e._connectionId]._id,
        name: connHash[e._connectionId].name || connHash[e._connectionId]._id,
      },
    }));

    return rowData;
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { classes } = this.props;
    const { loading, rowData, error, expanded } = this.state;

    if (loading) {
      return (
        <Paper className={classes.paper} elevation={4}>
          <Typography variant="headline" component="h3">
            Retrieving your Exports.
          </Typography>
          <Spinner loading />
        </Paper>
      );
    }

    if (!rowData) {
      return (
        <Paper className={classes.paper} elevation={4}>
          <Typography variant="headline" component="h3">
            You have no Exports.
          </Typography>
          <Typography component="p">
            You can create new Exports by logging into:
            <a href={process.env.API_ENDPOINT}>{process.env.API_ENDPOINT}</a>.
          </Typography>
        </Paper>
      );
    }

    if (error) {
      return <ErrorPanel error={error} />;
    }

    return (
      <Fragment>
        <Typography variant="display1">These are your exports</Typography>
        <div className={classes.root}>
          {rowData.map(e => (
            <ExpansionPanel
              key={e.id}
              expanded={expanded === e.id}
              onChange={this.handleChange(e.id)}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  {e.name} {e.type && `(${e.type} export)`}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  Last modified on <TimeAgo date={e.lastModified} />
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  Using connection: {e.connection.name} ({e.connection.type})
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </div>
      </Fragment>
    );
  }
}
