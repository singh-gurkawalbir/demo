import { Fragment } from 'react';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { confirmDialog } from '../../components/ConfirmDialog';
import actions from '../../actions';
import applications from '../../constants/applications';

const styles = theme => ({
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
  link: {
    color: theme.palette.text.secondary,
  },
  connectionDetails: {
    flexBasis: '66.66%',
    flexShrink: 0,
  },
});

function ConnectionsData(props) {
  const { classes, item, handleReferencesClick, handleSetDebugClick } = props;
  const dispatch = useDispatch();
  const handleDeleteClick = () => {
    confirmDialog({
      title: 'Confirm',
      message: 'Are you sure you want to delete this Connection?',
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            dispatch(actions.resource.delete('connections', item._id));
          },
        },
      ],
    });
  };

  const getQueueSize = () => {
    const queueSize = 0;

    for (let i = 0; item.queues && i < item.queues.length; i += 1) {
      if (item.queues[i].name === item._id) {
        item.queueSize = `${item.queues[i].size}`;
      }
    }

    return queueSize;
  };

  const getDisplayType = () => {
    const app = applications.find(
      a => a.id === (item.assistant ? item.assistant : item.type)
    );

    return app && app.name;
  };

  const getAPIValue = () => {
    if (item.type === 'rest') return item.rest && item.rest.baseURI;

    if (item.type === 'http') return item.http && item.http.baseURI;

    return '';
  };

  const showDownloadbutton = () => {
    let toReturn = false;

    if (item.debugDate) {
      if (moment() <= moment(item.debugDate)) {
        toReturn = true;
      } else {
        toReturn = moment() - moment(item.debugDate) <= 24 * 60 * 60 * 1000;
      }
    }

    return toReturn;
  };

  const handleRefreshMetadataClick = () => {};
  const handleViewAuditLog = () => {};

  return (
    <Fragment>
      <Typography className={classes.connectionDetails}>
        Type: {getDisplayType()}
        <br />
        Status: {item.offline ? 'Offline' : 'Online'}
        <br />
        API: {getAPIValue()}
        <br />
        Queue Size: {getQueueSize()}
        <br />
      </Typography>
      <Typography className={classes.secondaryHeading}>
        <Button component={Link} to={`/pg/connections/edit/${item._id}`}>
          Edit Connection
        </Button>
        <br />
        <Button onClick={() => handleRefreshMetadataClick(item._id)}>
          Refresh metadata
        </Button>
        <br />
        {showDownloadbutton() && (
          <Fragment>
            <Button
              onClick={() =>
                dispatch(actions.resourceForm.downloadDebugLogs(item._id))
              }>
              Download debug logs
            </Button>
            <br />
          </Fragment>
        )}
        <Button
          onClick={() =>
            handleSetDebugClick(item._id, item.name, item.debugDate)
          }>
          Configure debugger
        </Button>
        <br />
        <Button onClick={handleViewAuditLog}>View audit log</Button>
        <br />
        <Button onClick={() => handleReferencesClick(item._id)}>
          View references
        </Button>
        <br />
        <Button onClick={handleDeleteClick}>Delete connection</Button>
      </Typography>
    </Fragment>
  );
}

export default withStyles(styles)(ConnectionsData);
