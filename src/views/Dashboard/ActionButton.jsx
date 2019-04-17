import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

@withStyles(() => ({
  default: {
    marginRight: 5,
    color: '#fff',
    width: 24,
    height: 24,
  },
  SUCCESS: {
    backgroundColor: '#6CC706',
  },
  ERRORS: {
    backgroundColor: '#F53D05',
  },
  PENDING_SETUP: {
    backgroundColor: '#000000',
  },
  OFFLINE_CONNECTIONS: {
    backgroundColor: '#F53D05',
  },
}))
export default class ActionButton extends Component {
  state = { hover: false };
  handleOnMouseOver = () => {
    this.setState({ hover: true });
  };
  handleOnMouseOut = () => {
    this.setState({ hover: false });
  };
  render() {
    const { classes, data } = this.props;
    const { hover } = this.state;
    let label;
    let status;

    if (
      data._connectorId &&
      data.integration &&
      data.integration.mode !== 'settings'
    ) {
      status = 'PENDING_SETUP';
    } else if (data.offlineConnections && data.offlineConnections.length > 0) {
      status = 'OFFLINE_CONNECTIONS';
    } else if (data.numError && data.numError > 0) {
      status = 'ERRORS';
    } else {
      status = 'SUCCESS';
    }

    switch (status) {
      case 'PENDING_SETUP':
        label = hover ? 'Continue Setup' : 'Pending Setup';
        break;
      case 'OFFLINE_CONNECTIONS':
        label = hover ? 'Fix Connection' : 'Connection Down';
        break;
      case 'ERRORS':
        label = hover ? 'View Errors' : 'Errors';
        break;
      default:
        label = hover ? 'View Dashboard' : 'Success';
    }

    return (
      <Fragment>
        <Button
          size="small"
          color="primary"
          onMouseOver={this.handleOnMouseOver}
          onFocus={this.handleOnMouseOver}
          onMouseOut={this.handleOnMouseOut}
          onBlur={this.handleOnMouseOut}>
          <Avatar className={[classes[status], classes.default]} />
          {label}
        </Button>
      </Fragment>
    );
  }
}
