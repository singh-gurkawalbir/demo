import { Divider, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import BackArrowIcon from '../../icons/BackArrowIcon';
import CloseIcon from '../../icons/CloseIcon';
import LoadResources from '../../LoadResources';
import { selectors } from '../../../reducers';
import DynaSelect from '../../DynaForm/fields/DynaSelect';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  titleBar: {
    background: theme.palette.background.paper,
    display: 'flex',
    alignItems: 'center',
    padding: '14px 24px',
  },
  title: {
    flexGrow: 1,
  },

  divider: {
    height: theme.spacing(3),
    width: 1,
    marginRight: theme.spacing(1),
  },
  button: {
    padding: '4px 10px',
    marginRight: theme.spacing(0.5),
    color: theme.palette.secondary.light,
  },
  closeIcon: {
    padding: theme.spacing(0),
  },
  arrowLeft: {
    float: 'left',
    padding: 0,
    marginLeft: '-10px',
    marginRight: '10px',
    '&:hover': {
      background: 'none',
      color: theme.palette.secondary.dark,
    },
  },
  dynaSelect: {
    minWidth: 350,
    margin: theme.spacing(0, 2),
  },
  helpTextButton: {
    float: 'right',
    padding: 1,
    marginRight: theme.spacing(1),
  },
}));
const connectionsFilterConfig = {
  type: 'connections',
};

const flowJobConnectionsOptions = {ignoreBorrowedConnections: true};
export default function DrawerTitleBar({
  connectionId,
  flowId,
  onConnChange,
  parentUrl,
  backToParent,
}) {
  const classes = useStyles();
  const history = useHistory();
  const connections = useSelector(
    state => selectors.flowJobConnections(state, flowId, flowJobConnectionsOptions)
  );
  const connectionsResourceList = useSelectorMemo(
    selectors.makeResourceListSelector,
    connectionsFilterConfig
  ).resources;
  const connectionName = connectionsResourceList.find(
    c => c._id === connectionId
  )?.name;
  const handleConnectionChange = useCallback(
    (id, value) => {
      onConnChange(value);
    },
    [onConnChange]
  );
  const handleClose = useCallback(() => {
    history.push(parentUrl);
  }, [history, parentUrl]);

  return (
    <div className={classes.titleBar}>
      <LoadResources required resources="flows">
        {backToParent && (
          <IconButton
            data-test="backToDashboard"
            aria-label="back"
            onClick={handleClose}
            className={classes.arrowLeft}>
            <BackArrowIcon />
          </IconButton>
        )}
        <Typography variant="h3" className={classes.title}>
          {`Queue Stats : ${connectionName}`}
        </Typography>
        <DynaSelect
          id="queuedJobs_connection"
          className={classes.dynaSelect}
          value={connectionId}
          skipDefault
          onFieldChange={handleConnectionChange}
          options={[
            { items: connections.map(c => ({ label: c.name, value: c.id })) },
          ]}
        />
        <Divider orientation="vertical" className={classes.divider} />
        <IconButton
          data-test="closeQueuedJobs"
          aria-label="Close"
          onClick={handleClose}
          className={classes.closeIcon}>
          <CloseIcon />
        </IconButton>
      </LoadResources>
    </div>
  );
}
