import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import * as selectors from '../../reducers';
import Tile from './Tile';

const mapStateToProps = state => {
  const userPreferences = selectors.userPreferences(state);
  const resources = selectors.resourceList(state, {
    type: 'tiles',
    sandbox: userPreferences.environment === 'sandbox',
  });
  const integrations = selectors.resourceList(state, {
    type: 'integrations',
  });
  const published = selectors.resourceList(state, {
    type: 'published',
  });

  return {
    tiles: resources.resources,
    integrations: integrations.resources,
    published: published.resources,
  };
};

@hot(module)
@withStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: 12,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}))
class Dashboard extends Component {
  render() {
    const { classes, integrations, published } = this.props;
    let { tiles } = this.props;

    if (tiles.length && !integrations.length) {
      return null;
    }

    const connectorTiles = tiles.filter(t => t._connectorId);

    if (connectorTiles && !published.length) {
      return null;
    }

    tiles = tiles.map(t => {
      if (t._connectorId) {
        return {
          ...t,
          integration: integrations.find(i => i._id === t._integrationId),
          connector: published.find(i => i._id === t._connectorId),
        };
      }

      return t;
    });

    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          {tiles.map(t => (
            <Grid key={t._integrationId} item xs={3}>
              <Tile data={t} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(Dashboard);
