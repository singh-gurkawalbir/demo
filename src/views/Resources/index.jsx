import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import LoadResources from '../../components/LoadResources';
import FilteredResources from './FilteredResources';
import Edit from './Edit';
import Add from './Add';
import SearchOptions from './SearchOptions';
import * as selectors from '../../reducers';

export const availableResources = [
  'exports',
  'imports',
  'connections',
  'scripts',
  'agents',
  'asynchelpers',
  // 'integrations',
  // 'tiles',
];

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

@hot(module)
@withStyles(theme => ({
  appFrame: {
    zIndex: 1,
    height: '100%',
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
    height: `calc(100vh - ${theme.spacing(7)}px)`,
    width: theme.drawerWidth,
    padding: theme.spacing(1),
  },

  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  paper: {
    padding: theme.spacing(2),
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
        <Typography variant="h5">
          Use the keyword search to help find the resource you are looking for.
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
                  render={props => (
                    <Edit key={props.match.params.id} {...props} />
                  )}
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

// prettier-ignore
export default connect(mapStateToProps, null)(Resources);
