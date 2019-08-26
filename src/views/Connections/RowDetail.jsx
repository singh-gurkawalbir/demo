import { Fragment, useState } from 'react';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { confirmDialog } from '../../components/ConfirmDialog';
import actions from '../../actions';
import applications from '../../constants/applications';
import ResourceReferences from '../../components/ResourceReferences';
import ConfigureDebugger from '../../components/ConfigureDebugger';
import AuditLogDialog from '../../components/AuditLog/AuditLogDialog';

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
  const [showAuditLogDialog, setShowAuditLogDialog] = useState(false);
  const { classes, item } = props;
  const dispatch = useDispatch();
  const [id, setId] = useState(null);
  const [debugId, setDebugId] = useState(null);

  function handleAuditLogDialogClose() {
    setShowAuditLogDialog(false);
  }

  function handleReferencesClick(id) {
    setId(id);
  }

  function handleReferencesClose() {
    setId(null);
  }

  function handleSetDebugClick(id) {
    setDebugId(id);
  }

  function handleSetDebugClose() {
    setDebugId(null);
  }

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

  const handleRefreshMetadataClick = () => {
    if (item.type === 'netsuite') {
      dispatch(
        actions.metadata.request(item._id, 'recordTypes', 'suitescript', '', {
          refreshCache: true,
        })
      );
      dispatch(
        actions.metadata.request(item._id, 'savedSearches', 'suitescript', '', {
          refreshCache: true,
        })
      );
      dispatch(
        actions.metadata.request(item._id, 'recordTypes', 'webservices', '', {
          refreshCache: true,
          recordTypeOnly: true,
        })
      );
    }
  };

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
        {item && (item.type === 'netsuite' || item.type === 'salesforce') && (
          <Fragment>
            <Button onClick={() => handleRefreshMetadataClick()}>
              Refresh metadata
            </Button>
            <br />
          </Fragment>
        )}
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

        <Button onClick={() => handleSetDebugClick(item._id)}>
          Configure debugger
        </Button>
        <br />
        <Button
          onClick={() => {
            setShowAuditLogDialog(true);
          }}>
          View audit log
        </Button>
        <br />
        <Button onClick={() => handleReferencesClick(item._id)}>
          View references
        </Button>
        <br />
        <Button onClick={handleDeleteClick}>Delete connection</Button>
        {id && (
          <ResourceReferences
            type="connections"
            id={id}
            onClose={handleReferencesClose}
          />
        )}
        {debugId && (
          <ConfigureDebugger
            id={item._id}
            name={item.name}
            debugDate={item.debugDate}
            onClose={handleSetDebugClose}
          />
        )}
        {showAuditLogDialog && (
          <AuditLogDialog
            resourceType="connections"
            resourceId={item._id}
            onClose={handleAuditLogDialogClose}
          />
        )}
      </Typography>
    </Fragment>
  );
}

export default withStyles(styles)(ConnectionsData);
