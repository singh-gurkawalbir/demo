import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
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
    width: '98%',
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    overflowX: 'auto',
    // textAlign: 'center',
  },
  titleBox: {
    display: 'flex',
  },
  title: {
    marginBottom: theme.spacing.unit * 2,
    flexBasis: '50%',
    flexShrink: 0,
  },
  textField: {
    width: '350px',
  },
  button: {
    margin: theme.spacing.unit,
    textAlign: 'center',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 'bold',
    flexBasis: '50%',
    flexShrink: 0,
  },
  app: {
    flexBasis: '16.66%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },

  exportDetails: {
    flexBasis: '66.66%',
    flexShrink: 0,
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
    search: '',
    pageSize: 3,
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
    const cHash = {};

    // convert conn array to hash keyed from conn id.
    // lets join exports and connection into hybrid obj.
    connections.map(c => (cHash[c._id] = c));

    // build view model for this view.
    const rowData = exports.map(e => ({
      id: e._id,
      name: e.name || e._id,
      type: e.type,
      lastModified: e.lastModified,
      app: cHash[e._connectionId].assistant || cHash[e._connectionId].type,
      connection: {
        type: cHash[e._connectionId].type,
        id: cHash[e._connectionId]._id,
        name: cHash[e._connectionId].name || cHash[e._connectionId]._id,
      },
    }));

    return rowData;
  }

  handleSearch = event => {
    this.setState({
      pageSize: 3,
      search: event.target.value,
    });
  };

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  handleMore = () => {
    this.setState({
      pageSize: this.state.pageSize + 2,
    });
  };

  testExport = e => {
    const { search } = this.state;

    if (!search) return true;

    const valuesToSearch = [
      e.id,
      e.name,
      e.connection.name,
      e.connection.assistant,
      e.connection.type,
    ];
    const textToSearch = valuesToSearch.join('|').toUpperCase();

    return textToSearch.indexOf(search.toUpperCase()) >= 0;
  };

  render() {
    const { classes } = this.props;
    const { loading, rowData, error, expanded, pageSize, search } = this.state;

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

    const filteredData = rowData.filter(this.testExport);
    const pageData = filteredData.slice(0, pageSize);

    return (
      <Fragment>
        <div className={classes.root}>
          <div className={classes.titleBox}>
            <Typography className={classes.title} variant="display1">
              These are your exports
            </Typography>
            <Typography className={classes.secondaryHeading}>
              <TextField
                onChange={this.handleSearch}
                value={search}
                id="search"
                label="Search by export, connection or app name"
                type="search"
                className={classes.textField}
                margin="normal"
              />
            </Typography>
          </div>

          {pageData.map(e => (
            <ExpansionPanel
              key={e.id}
              expanded={expanded === e.id}
              onChange={this.handlePanelChange(e.id)}>
              <ExpansionPanelSummary
                focused={(expanded === e.id).toString()}
                expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  {e.name} {e.type && `(${e.type} export)`}
                </Typography>
                <Typography className={classes.app}>{e.app}</Typography>
                <Typography className={classes.secondaryHeading}>
                  Last modified on <TimeAgo date={e.lastModified} />.
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography className={classes.exportDetails}>
                  Created on {new Date(e.lastModified).toLocaleDateString()}
                  <br />
                  Using a {e.connection.type.toUpperCase()} connection named:
                  {e.connection.name}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  <Link to="/export/preview">Run this Export now</Link>
                  <br />
                  <Link to="/export/clone">Clone this Export</Link>
                  <br />
                  <Link to="/export/push">
                    Publish export data to Data Pipeline
                  </Link>
                  <br />
                  <Link to="/export/clone">View Audit Log</Link>
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}

          {filteredData.length > pageSize && (
            <Button
              onClick={this.handleMore}
              variant="raised"
              size="medium"
              color="primary"
              className={classes.button}>
              More results ({filteredData.length - pageSize} left)
            </Button>
          )}
        </div>
      </Fragment>
    );
  }
}
