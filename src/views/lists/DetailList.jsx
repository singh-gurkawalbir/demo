import { hot } from 'react-hot-loader';
import { Component, Fragment, cloneElement } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TimeAgo from 'react-timeago';
import TitleBar from './TitleBar';

@hot(module)
@withStyles(theme => ({
  root: {
    width: '98%',
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    overflowX: 'auto',
    // textAlign: 'center',
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
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  }),
  focusedSummary: {
    backgroundColor: 'red',
  },
}))
export default class Exports extends Component {
  state = {
    search: '',
    pageSize: 3,
    expanded: null,
  };

  // TODO: see this gist for how to bind window events to react components
  // I want this so that as a user types, the keys automatically
  // are placed in the search.
  // https://gist.github.com/eliperelman/068e47353eaf526716d97185429c317d

  buildRowData() {
    const { exports, connections } = this.props;
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
      app: (
        cHash[e._connectionId].assistant || cHash[e._connectionId].type
      ).toUpperCase(),
      connection: {
        type: cHash[e._connectionId].type,
        id: cHash[e._connectionId]._id,
        name: cHash[e._connectionId].name || cHash[e._connectionId]._id,
      },
    }));

    return rowData;
  }

  onSearchChange = event => {
    // TODO: use this component to highlight the matching text in the resuts:
    // https://github.com/bvaughn/react-highlight-words
    this.setState({
      pageSize: 3,
      search: event.target.value,
      expanded: null,
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
    const { rowData, classes, itemName, children } = this.props;
    const { expanded, pageSize, search } = this.state;

    if (!rowData) {
      return (
        <Paper className={classes.paper} elevation={4}>
          <Typography variant="headline" component="h3">
            You have no {itemName}.
          </Typography>
          <Typography component="p">
            You can create new {itemName} by logging into:
            <a href={process.env.API_ENDPOINT}>{process.env.API_ENDPOINT}</a>.
          </Typography>
        </Paper>
      );
    }

    const filteredData = rowData.filter(this.testExport);
    const pageData = filteredData.slice(0, pageSize);

    // see link below for an explanation of how we pass each item
    // to the child RowDetail component within ExpansionPanelDetails
    // https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children
    return (
      <Fragment>
        <div className={classes.root}>
          <TitleBar
            searchText={search}
            handleSearch={this.onSearchChange}
            itemName={itemName}
          />
          {pageData.map(e => (
            <ExpansionPanel
              key={e.id}
              expanded={expanded === e.id || pageData.length === 1}
              onChange={this.handlePanelChange(e.id)}>
              <ExpansionPanelSummary
                classes={{ focused: classes.focusedSummary }}
                focused={(
                  expanded === e.id || pageData.length === 1
                ).toString()}
                expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  {e.name} {e.type && `(${e.type} export)`}
                </Typography>
                <Typography className={classes.app}>{e.app}</Typography>
                <Typography className={classes.secondaryHeading}>
                  Last modified <TimeAgo date={e.lastModified} />.
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {cloneElement(children, { item: e })}
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
