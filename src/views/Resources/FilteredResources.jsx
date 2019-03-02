import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Link, Route } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import Button from '@material-ui/core/Button';
// import shortid from 'shortid';
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
    // marginLeft: theme.spacing.unit,
  },
  resourceItems: {
    marginLeft: theme.spacing.unit,
  },
  listItem: {
    paddingTop: 0,
  },
  addResource: {
    left: theme.spacing.unit * 2,
    bottom: theme.spacing.unit / 4,
  },
}))
class FilteredResources extends Component {
  // TODO: use this component to highlight the matching text in the resuts:
  // https://github.com/bvaughn/react-highlight-words

  render() {
    const { list, classes, handleMore } = this.props;
    const resourceType = list.type;
    const daysOld = lastModified => (
      <span>
        Modified <TimeAgo date={lastModified} />.
      </span>
    );

    return (
      <div className={classes.root}>
        <Typography variant="h5">
          {resourceType.toUpperCase()}
          <Switch>
            <Route
              path="/pg/resources/:resourceType/add/:id"
              render={() => null}
            />
            {/*  Hide the "Add" until we have a good implementation for it.
            <Route
              render={() => (
                <Button
                  size="small"
                  variant="contained"
                  aria-label="Add"
                  component={Link}
                  to={`/pg/resources/${resourceType}/add/${shortid.generate()}`}
                  className={classes.addResource}>
                  Add
                </Button>
              )}
            />
          */}
          </Switch>
        </Typography>

        {!list.count ? (
          <Typography variant="h6">None.</Typography>
        ) : (
          <List>
            {list.resources.map(r => (
              <ListItem
                className={classes.listItem}
                button
                key={r._id}
                component={Link}
                to={`/pg/resources/${resourceType}/edit/${r._id}`}>
                <Avatar>
                  <ImageIcon />
                </Avatar>
                <ListItemText
                  primary={r.name || r._id}
                  secondary={daysOld(r.lastModified)}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItem>
            ))}

            {list.filtered > list.count && (
              <Button
                onClick={handleMore(list.count + 2)}
                size="small"
                variant="outlined">
                Show more results ({list.filtered - list.count} left)
              </Button>
            )}
          </List>
        )}
      </div>
    );
  }
}

// prettier-ignore
export default connect(null, mapDispatchToProps)(FilteredResources);
