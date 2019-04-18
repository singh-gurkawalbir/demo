import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import TileAction from './TileAction';
import * as selectors from '../../reducers';

const mapStateToProps = (state, { data }) => {
  const permissions = selectors.userPermissionsOnIntegration(
    state,
    data && data._integrationId
  );

  return {
    permissions,
  };
};

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
class Tile extends Component {
  render() {
    const { classes, data, permissions } = this.props;
    let { numFlows } = data;
    let connectorOwner;

    numFlows = `${numFlows} Flow${numFlows === 1 ? '' : 's'}`;

    if (data._connectorId) {
      if (data.connector) {
        connectorOwner =
          data.connector.user.company || data.connector.user.name;
      }
    }

    let status;

    if (
      data._connectorId &&
      data.integration &&
      data.integration.mode !== 'settings'
    ) {
      status = 'IS_PENDING_SETUP';
    } else if (data.offlineConnections && data.offlineConnections.length > 0) {
      status = 'HAS_OFFLINE_CONNECTIONS';
    } else if (data.numError && data.numError > 0) {
      status = 'HAS_ERRORS';
    } else {
      status = 'SUCCESS';
    }

    return (
      <Card className={classes.card}>
        <CardActions>
          <TileAction
            size="small"
            color="primary"
            status={status}
            data={data}
          />
        </CardActions>
        <CardContent>
          <Typography variant="headline" component="h2">
            {data.name}
          </Typography>
        </CardContent>
        <Divider component="br" />
        <CardActions>
          {status === 'IS_PENDING_SETUP' && (
            <Typography>Click to continue setup.</Typography>
          )}
          {status !== 'IS_PENDING_SETUP' &&
            permissions &&
            permissions.accessLevel && (
              <Link
                className={classes.navLink}
                to={`/pg/${data._connectorId ? 'connectors' : 'integrations'}/${
                  data._integrationId
                }/settings`}>
                {permissions.accessLevel === 'manage' ? 'Manage' : 'Monitor'}
              </Link>
            )}
          {data.tag && (
            <Chip label={data.tag} color="secondary" className={classes.tag} />
          )}
        </CardActions>
        <Divider />
        <CardActions>
          <Typography>
            {data._connectorId ? 'SmartConnector' : numFlows}
          </Typography>
          <Typography className={classes.connectorOwner}>
            {connectorOwner}
          </Typography>
        </CardActions>
      </Card>
    );
  }
}

export default connect(
  mapStateToProps,
  null
)(Tile);
