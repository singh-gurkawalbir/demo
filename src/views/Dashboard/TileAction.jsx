import { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import classNames from 'classnames';
import { TILE_STATUS } from '../../utils/constants';

const styles = () => ({
  default: {
    marginRight: 5,
    color: '#fff',
    width: 16,
    height: 16,
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
});

function TileAction({ classes, tile }) {
  const [hover, setHover] = useState(false);

  function handleOnMouseOver() {
    setHover(true);
  }

  function handleOnMouseOut() {
    setHover(false);
  }

  const { status, numError } = tile;
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
    <Button
      data-test={label}
      size="small"
      color="primary"
      onMouseOver={handleOnMouseOver}
      onFocus={handleOnMouseOver}
      onMouseOut={handleOnMouseOut}
      onBlur={handleOnMouseOut}>
      <Avatar
        className={classNames(classes.default, classes[statusClassName])}
      />
      {label}
    </Button>
  );
}

export default withStyles(styles)(TileAction);
