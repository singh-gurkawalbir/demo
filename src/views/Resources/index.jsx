import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LoadResources from '../../components/LoadResources';
import { availableResources } from '../../actions';
import FilteredResources from './FilteredResources';
import Edit from './Edit';
import Add from './Add';
import SearchOptions from './SearchOptions';
import * as selectors from '../../reducers';

const mapStateToProps = state => {
  const filterName = 'allResources';
  const filter = selectors.filter(state, filterName);
  const allResources = availableResources.map(resourceType => {
    const resourceFilter = selectors.filter(state, resourceType);
    const resources = selectors.resourceList(state, {
      type: resourceType,
      take: resourceFilter.take || 3,
      keyword: filter.keyword,
    });

    return resources;
  });

  return {
    allResources,
  };
};

const drawerWidth = 320;

@hot(module)
@withStyles(theme => ({
  appFrame: {
    minHeight: 500,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },

  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },

  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    padding: theme.spacing.unit,
  },

  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing.triple,
  },
  paper: {
    padding: theme.spacing.double,
  },
}))
class Resources extends Component {
  render() {
    const { allResources, classes } = this.props;
    const NoEdit = () => (
      <div>
        <Typography variant="h6">
          The left sidebar lists all your resources organized by type.
        </Typography>
        <br />
        <Typography variant="subtitle1">
          Use the keyword search to help find the resoure you are looking for.
        </Typography>
      </div>
    );

    return (
      <LoadResources resources={availableResources}>
        <div className={classes.appFrame}>
          <Drawer
            variant="permanent"
            anchor="left"
            classes={{
              paper: classes.drawerPaper,
            }}>
            <Typography variant="h5">Available Resources</Typography>
            <SearchOptions />
            {allResources.map(r => (
              <Route
                key={`${r.type}-section`}
                component={() => <FilteredResources list={r} />}
              />
            ))}
          </Drawer>
          <main className={classes.content}>
            <Paper className={classes.paper}>
              <Switch>
                <Route
                  path="/pg/resources/:resourceType/edit/:id"
                  component={Edit}
                />
                <Route
                  path="/pg/resources/:resourceType/add/:id"
                  render={props => (
                    <Add key={props.match.params.id} {...props} />
                  )}
                />
                <Route component={NoEdit} />
              </Switch>
            </Paper>
          </main>
        </div>
      </LoadResources>
    );
  }
}

export default connect(mapStateToProps, null)(Resources);
