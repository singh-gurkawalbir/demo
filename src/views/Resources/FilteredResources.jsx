import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
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
    // marginLeft: theme.spacing.unit,
  },
  resourceItems: {
    marginLeft: theme.spacing.unit,
  },
  listItem: {
    paddingTop: 0,
  },
}))
class FilteredResources extends Component {
  // TODO: use this component to highlight the matching text in the resuts:
  // https://github.com/bvaughn/react-highlight-words

  render() {
    const { list, classes, handleMore } = this.props;
    const resourceType = list.type;

    if (!list.count) {
      return <Typography variant="h5">You have no {resourceType}.</Typography>;
    }

    const daysOld = lastModified => (
      <span>
        Modified <TimeAgo date={lastModified} /> ago.
      </span>
    );

    return (
      <Fragment>
        <div className={classes.root}>
          <Typography variant="h5">{resourceType.toUpperCase()}</Typography>
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
                color="secondary">
                Show more results ({list.filtered - list.count} left)
              </Button>
            )}
          </List>
        </div>
      </Fragment>
    );
  }
}

export default connect(
  null,
  mapDispatchToProps
)(FilteredResources);
