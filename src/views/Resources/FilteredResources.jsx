import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Link, Route } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import shortid from 'shortid';
import ApplicationImg from '../../components/icons/ApplicationImg';
import ResourceImage from '../../components/icons/ResourceImg';
import actions from '../../actions';

const mapDispatchToProps = (dispatch, { list }) => ({
  handleMore: take => () => {
    dispatch(actions.patchFilter(list.type, { take }));
  },
});

@hot(module)
@withStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
  },
  resourceItems: {
    marginLeft: theme.spacing(1),
  },
  listItem: {
    paddingTop: 0,
  },
  addResource: {
    left: theme.spacing(2),
    bottom: theme.spacing(0.25),
  },
  avatar: {
    backgroundColor: theme.palette.background.paper2,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  listName: {
    wordBreak: 'break-word',
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

    // if (!list.count) return null;

    return (
      <div className={classes.root}>
        <Typography variant="h5">
          {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
          <Switch>
            <Route
              path="/pg/resources/:resourceType/add/:id"
              render={() => null}
            />
            {
              <Route
                render={() => (
                  <Button
                    size="small"
                    data-test={`addNew${resourceType}`}
                    variant="outlined"
                    color="primary"
                    aria-label="Add"
                    component={Link}
                    to={`/pg/resources/${resourceType}/add/new-${shortid.generate()}`}
                    className={classes.addResource}>
                    Add
                  </Button>
                )}
              />
            }
          </Switch>
        </Typography>

        <List>
          {list.resources.map(r => (
            <ListItem
              className={classes.listItem}
              button
              key={r._id}
              data-test={`edit${r._id}`}
              component={Link}
              to={`/pg/resources/${resourceType}/edit/${r._id}`}>
              <ListItemAvatar>
                {['exports', 'imports', 'connections'].includes(
                  resourceType
                ) ? (
                  <Avatar className={classes.avatar}>
                    <ApplicationImg
                      assistant={r.assistant}
                      type={
                        resourceType === 'connections' ? r.type : r.adaptorType
                      }
                    />
                  </Avatar>
                ) : (
                  <ResourceImage resource={r} resourceType={resourceType} />
                )}
              </ListItemAvatar>
              <ListItemText
                primary={r.name || r._id}
                secondary={daysOld(r.lastModified)}
                className={classes.listName}
              />
            </ListItem>
          ))}

          {list.filtered > list.count && (
            <Button
              data-test="showMoreResults"
              onClick={handleMore(list.count + 2)}
              size="small"
              variant="text">
              Show more results ({list.filtered - list.count} left)
            </Button>
          )}
        </List>
      </div>
    );
  }
}

// prettier-ignore
export default connect(null, mapDispatchToProps)(FilteredResources);
