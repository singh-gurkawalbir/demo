import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import TileAction from './TileAction';

@withStyles(theme => ({
  card: {
    cursor: 'move',
  },
  connectorOwner: {
    marginLeft: 'auto',
  },
  navLink: {
    color: theme.appBar.contrast,
    paddingRight: theme.spacing.unit * 3,
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
}))
export default class Tile extends Component {
  render() {
    const { classes, data } = this.props;
    const numFlowsText = `${data.numFlows} Flow${
      data.numFlows === 1 ? '' : 's'
    }`;
    const accessLevel =
      data.integration &&
      data.integration.permissions &&
      data.integration.permissions.accessLevel;

    return (
      <Card className={classes.card}>
        <CardActions>
          <TileAction size="small" color="primary" data={data} />
        </CardActions>
        <CardContent>
          <Typography variant="h5" component="h2">
            {data.name}
          </Typography>
        </CardContent>
        <Divider component="br" />
        <CardActions>
          {data.status === 'IS_PENDING_SETUP' && (
            <Typography>Click to continue setup.</Typography>
          )}
          {data.status !== 'IS_PENDING_SETUP' && accessLevel && (
            <Link
              className={classes.navLink}
              to={`/pg/${data._connectorId ? 'connectors' : 'integrations'}/${
                data._integrationId
              }/settings`}>
              {accessLevel === 'monitor' ? 'Monitor' : 'Manage'}
            </Link>
          )}
          {data.tag && (
            <Chip label={data.tag} color="secondary" className={classes.tag} />
          )}
        </CardActions>
        <Divider />
        <CardActions>
          <Typography>
            {data._connectorId ? 'SmartConnector' : numFlowsText}
          </Typography>
          <Typography className={classes.connectorOwner}>
            {data.connector && data.connector.owner}
          </Typography>
        </CardActions>
      </Card>
    );
  }
}
