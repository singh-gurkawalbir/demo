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
    backgroundColor: '#6CC706',
  },
  HAS_ERRORS: {
    backgroundColor: '#F53D05',
  },
  IS_PENDING_SETUP: {
    backgroundColor: '#000000',
  },
  HAS_OFFLINE_CONNECTIONS: {
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
    const { classes, status, data } = this.props;
    const { hover } = this.state;
    let label;

    switch (status) {
      case 'IS_PENDING_SETUP':
        label = hover ? 'Continue Setup' : 'Pending Setup';
        break;
      case 'HAS_OFFLINE_CONNECTIONS':
        label = hover ? 'Fix Connection' : 'Connection Down';
        break;
      case 'HAS_ERRORS':
        label = hover
          ? 'View Errors'
          : `${data.numError} Error${data.numError > 0 ? 's' : ''}`;
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
          <Avatar className={[classes.default, classes[status]].join(' ')} />
          {label}
        </Button>
      </Fragment>
    );
  }
}
