import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography, IconButton, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../reducers';
import CloseIcon from '../../../components/icons/CloseIcon';
import LoadResources from '../../../components/LoadResources';
import BackArrowIcon from '../../../components/icons/BackArrowIcon';
import DynaSelect from '../../DynaForm/fields/DynaSelect';

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
    padding: theme.spacing(0.5),
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
}));

export default function DrawerTitleBar({
  connectionId,
  flowId,
  onClose,
  onConnChange,
  parentUrl,
  backToParent,
}) {
  const classes = useStyles();
  const history = useHistory();
  const connections = useSelector(
    state => selectors.flowJobConnections(state, flowId),
    (left, right) => left.length === right.length
  );
  const connectionName = useSelector(state => {
    const { resources: connections } = selectors.resourceListWithPermissions(
      state,
      {
        type: 'connections',
      }
    );
    const connection = connections.find(c => c._id === connectionId);

    return connection.name;
  });
  const handleConnectionChange = useCallback(
    (id, value) => {
      onConnChange(value);
    },
    [onConnChange]
  );
  const handleClose = useCallback(() => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    } else {
      history.push(parentUrl);
    }
  }, [history, onClose, parentUrl]);

  return (
    <div className={classes.titleBar}>
      <LoadResources required resources="flows">
        {backToParent && (
          <IconButton
            data-test="openBasicMapping"
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
          label="Connection"
          value={connectionId}
          onFieldChange={handleConnectionChange}
          options={[
            { items: connections.map(c => ({ label: c.name, value: c.id })) },
          ]}
        />

        <Divider orientation="veritical" className={classes.divider} />
        <IconButton
          data-test="closeCategoryMapping"
          aria-label="Close"
          onClick={handleClose}
          className={classes.closeIcon}>
          <CloseIcon />
        </IconButton>
      </LoadResources>
    </div>
  );
}
