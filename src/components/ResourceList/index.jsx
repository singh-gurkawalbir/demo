import { hot } from 'react-hot-loader';
import { Component, Fragment, cloneElement } from 'react';
import { connect } from 'react-redux';
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
import * as selectors from '../../reducers';
import actions from '../../actions';

const mapStateToProps = (state, { resourceType }) => {
  // console.log('mapStateToProps args', state, ownProps);
  const filter = selectors.filter(state, resourceType) || { take: 3 };
  const list = selectors.resourceList(state, {
    type: resourceType,
    take: filter.take,
    keyword: filter.keyword,
  });

  return {
    list,
    filter,
  };
};

const mapDispatchToProps = (dispatch, { resourceType }) => ({
  handleMore: take => () => {
    dispatch(actions.patchFilter(resourceType, { take }));
  },
});

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
class ResourceList extends Component {
  state = {
    expanded: null,
  };

  // TODO: see this gist for how to bind window events to react components
  // I want this so that as a user types, the keys automatically
  // are placed in the search.
  // https://gist.github.com/eliperelman/068e47353eaf526716d97185429c317d

  // TODO: use this component to highlight the matching text in the resuts:
  // https://github.com/bvaughn/react-highlight-words

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const {
      list,
      classes,
      displayName,
      children,
      handleMore,
      resourceType,
    } = this.props;
    const { expanded } = this.state;

    if (!list.count) {
      return (
        <Paper className={classes.paper} elevation={4}>
          <Typography variant="headline" component="h3">
            You have no {displayName}.
          </Typography>
          <Typography component="p">
            You can create new {displayName} by logging into:
            <a href={process.env.API_ENDPOINT}>{process.env.API_ENDPOINT}</a>.
          </Typography>
        </Paper>
      );
    }

    // see link below for an explanation of how we pass each item
    // to the child RowDetail component within ExpansionPanelDetails
    // https://stackoverflow.com/questions/32370994/how-to-pass-props-to-this-props-children
    return (
      <Fragment>
        <div className={classes.root}>
          <TitleBar resourceType={resourceType} itemName={displayName} />
          {list.resources.map(r => (
            <ExpansionPanel
              key={r._id}
              expanded={expanded === r._id || list.count === 1}
              onChange={this.handlePanelChange(r._id)}>
              <ExpansionPanelSummary
                classes={{ focused: classes.focusedSummary }}
                focused={(expanded === r._id || list.count === 1).toString()}
                expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>
                  {r.name || r._id}
                </Typography>
                <Typography className={classes.app}>
                  {r.connection &&
                    (r.connection.assistant || r.connection.type)}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                  Last modified <TimeAgo date={r.lastModified} />.
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {cloneElement(children, { item: r })}
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}

          {list.filtered > list.count && (
            <Button
              onClick={handleMore(list.count + 2)}
              variant="raised"
              size="medium"
              color="primary"
              className={classes.button}>
              Show more results ({list.filtered - list.count} left)
            </Button>
          )}
        </div>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResourceList);
