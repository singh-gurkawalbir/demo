import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import * as selectors from '../../reducers';
import Tile from './Tile';
import LoadResources from '../../components/LoadResources';

const mapStateToProps = state => {
  const tiles = selectors.tiles(state);

  return {
    tiles,
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
    const { classes, tiles } = this.props;

    return (
      <LoadResources required resources="published, integrations, tiles">
        <div className={classes.root}>
          <Grid container spacing={24}>
            {tiles.map(t => (
              <Grid key={t._integrationId} item xs={3}>
                <Tile data={t} />
              </Grid>
            ))}
          </Grid>
        </div>
      </LoadResources>
    );
  }
}

export default connect(mapStateToProps)(Dashboard);
