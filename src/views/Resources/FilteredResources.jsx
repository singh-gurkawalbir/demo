import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import actions from '../../actions';

const mapDispatchToProps = (dispatch, { list }) => ({
  handleMore: take => () => {
    dispatch(actions.patchFilter(list.type, { take }));
  },
});

@hot(module)
@withStyles(theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    marginLeft: theme.spacing.unit,
  },
  resourceItems: {
    marginLeft: theme.spacing.unit,
  },
}))
class FilteredResources extends Component {
  // TODO: use this component to highlight the matching text in the resuts:
  // https://github.com/bvaughn/react-highlight-words

  render() {
    const { list, classes, handleMore } = this.props;
    const resourceType = list.type;

    if (!list.count) {
      return (
        <Typography variant="headline">You have no {resourceType}.</Typography>
      );
    }

    return (
      <Fragment>
        <div className={classes.root}>
          <Typography variant="headline">
            {resourceType.toUpperCase()}
          </Typography>
          <div className={classes.resourceItems}>
            {list.resources.map(r => (
              <Typography
                key={r._id}
                variant="body2"
                component={Link}
                to={`/pg/resources/${resourceType}/edit/${r._id}`}>
                {r.name || r._id}
              </Typography>
            ))}

            {list.filtered > list.count && (
              <Button
                onClick={handleMore(list.count + 2)}
                size="small"
                color="secondary">
                Show more results ({list.filtered - list.count} left)
              </Button>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(null, mapDispatchToProps)(FilteredResources);
