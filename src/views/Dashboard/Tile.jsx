import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import TileAction from './TileAction';
import getRoutePath from '../../utils/routePaths';
import { INTEGRATION_ACCESS_LEVELS } from '../../utils/constants';

const styles = theme => ({
  card: {
    cursor: 'move',
  },
  connectorOwner: {
    marginLeft: 'auto',
  },
  navLink: {
    color: theme.appBar.contrast,
    paddingRight: theme.spacing.triple,
    letterSpacing: '1.3px',
    fontSize: '13px',
    fontWeight: 500,
    textDecoration: 'none',
    textTransform: 'uppercase',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  tag: {
    marginLeft: 'auto',
    maxWidth: '50%',
  },
});

function Tile({ classes, tile }) {
  const numFlowsText = `${tile.numFlows} Flow${tile.numFlows === 1 ? '' : 's'}`;
  const accessLevel =
    tile.integration &&
    tile.integration.permissions &&
    tile.integration.permissions.accessLevel;

  return (
    <Card className={classes.card}>
      <CardActions>
        <TileAction size="small" color="primary" tile={tile} />
      </CardActions>
      <CardContent>
        <Typography variant="h5" component="h2">
          {tile.name}
        </Typography>
      </CardContent>
      <Divider component="br" />
      <CardActions>
        {tile.status === 'IS_PENDING_SETUP' && (
          <Typography>Click to continue setup.</Typography>
        )}
        {tile.status !== 'IS_PENDING_SETUP' && accessLevel && (
          <Link
            className={classes.navLink}
            to={getRoutePath(
              `/${tile._connectorId ? 'integrations' : 'integrations'}/${
                tile._integrationId
              }/settings/flows`
            )}>
            {accessLevel === INTEGRATION_ACCESS_LEVELS.MONITOR
              ? 'Monitor'
              : 'Manage'}
          </Link>
        )}
        {tile.status !== 'IS_PENDING_SETUP' && accessLevel && (
          <Link
            className={classes.navLink}
            to={getRoutePath(
              `/${tile._connectorId ? 'integrations' : 'integrations'}/${
                tile._integrationId
              }/dashboard`
            )}>
            Dashboard
          </Link>
        )}
        {tile.tag && (
          <Chip label={tile.tag} color="secondary" className={classes.tag} />
        )}
      </CardActions>
      <Divider />
      <CardActions>
        <Typography>
          {tile._connectorId ? 'SmartConnector' : numFlowsText}
        </Typography>
        <Typography className={classes.connectorOwner}>
          {tile.connector && tile.connector.owner}
        </Typography>
      </CardActions>
    </Card>
  );
}

export default withStyles(styles)(Tile);
