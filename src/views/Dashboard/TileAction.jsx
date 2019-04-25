import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import classNames from 'classnames';
import { TILE_STATUS } from '../../utils/constants';

@withStyles(() => ({
  default: {
    marginRight: 5,
    color: '#fff',
    width: 24,
    height: 24,
    backgroundColor: '#6CC706',
  },
  errors: {
    backgroundColor: '#F53D05',
  },
  pending_setup: {
    backgroundColor: '#000000',
  },
  offline_connections: {
    backgroundColor: '#F53D05',
  },
}))
export default class TileAction extends Component {
  state = { hover: false };
  handleOnMouseOver = () => {
    this.setState({ hover: true });
  };
  handleOnMouseOut = () => {
    this.setState({ hover: false });
  };
  render() {
    const { classes, data } = this.props;
    const { status, numError } = data;
    const { hover } = this.state;
    let label;
    let statusClassName;

    switch (status) {
      case TILE_STATUS.IS_PENDING_SETUP:
        label = hover ? 'Continue Setup' : 'Pending Setup';
        statusClassName = 'pending_setup';
        break;
      case TILE_STATUS.HAS_OFFLINE_CONNECTIONS:
        label = hover ? 'Fix Connection' : 'Connection Down';
        statusClassName = 'offline_connections';
        break;
      case TILE_STATUS.HAS_ERRORS:
        label = hover
          ? 'View Errors'
          : `${numError} Error${numError > 0 ? 's' : ''}`;
        statusClassName = 'errors';
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
          <Avatar
            className={classNames(classes.default, classes[statusClassName])}
          />
          {label}
        </Button>
      </Fragment>
    );
  }
}
