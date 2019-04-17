import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import SvgIcon from '@material-ui/core/SvgIcon';
import IconButton from '@material-ui/core/IconButton';
import ActionButton from './ActionButton';

@withStyles(() => ({
  card: {},
  connectorOwner: {
    marginLeft: 'auto',
  },
}))
export default class SimpleCard extends Component {
  render() {
    const { classes, data } = this.props;
    let { numFlows } = data;
    let connectorOwner;

    numFlows = `${numFlows} Flow${numFlows === 1 ? '' : 's'}`;

    if (data._connectorId) {
      if (data.connector) {
        connectorOwner =
          data.connector.user.company || data.connector.user.name;
      }
    }

    return (
      <div>
        <Card className={classes.card}>
          <CardActions>
            <ActionButton size="small" color="primary" data={data} />
          </CardActions>
          <CardContent>
            <Typography variant="headline" component="h2">
              {data.name}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {data.tag}
            </Typography>
            <IconButton>
              <SvgIcon>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </SvgIcon>
            </IconButton>
          </CardContent>
          <Divider light />
          <CardActions>
            <Typography>
              {data._connectorId ? 'SmartConnector' : numFlows}
            </Typography>
            <Typography className={classes.connectorOwner}>
              {connectorOwner}
            </Typography>
          </CardActions>
        </Card>
      </div>
    );
  }
}
