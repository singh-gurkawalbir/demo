import { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { useRouteMatch, useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import * as selectors from '../../reducers';
import actions from '../../actions';
import ShowStatus from '../ShowStatus';

const useStyles = makeStyles(theme => ({
  snackbarContent: {
    '& > div:first-child': {
      width: '100%',
      minWidth: '100%',
      '& > div:first-child': {
        width: '100%',
        minWidth: '100%',
      },
    },
  },
  fixConnectionBtn: {
    padding: 0,
    color: theme.palette.primary.main,
  },
}));
const CONN_OFFLINE_TEXT =
  'The connection associated with this export is currently offline and configuration is limited';

export default function OfflineConnectionNotification(props) {
  const { resourceId, resourceType } = props;
  const connectionId = useSelector(state => {
    const { merged: resource } = selectors.resourceData(
      state,
      resourceType,
      resourceId
    );

    return resource._connectionId;
  });
  const dispatch = useDispatch();
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(actions.resource.connections.pingAndUpdate(connectionId));
  }, [connectionId, dispatch]);

  const connectionOffline = useSelector(
    state => selectors.connectionStatus(state, connectionId).offline
  );

  if (!connectionOffline) {
    return null;
  }

  const handleClick = () => {
    history.push(
      `${
        match.path.split(':')[0]
      }edit/connections/${connectionId}?fixConnnection=true`
    );
  };

  return (
    <ShowStatus variant="warning" className={classes.snackbarContent}>
      <Typography variant="h6">{CONN_OFFLINE_TEXT}</Typography>
      <Typography variant="h6">
        <Button
          data-test="fixConnection"
          size="small"
          className={classes.fixConnectionBtn}
          onClick={handleClick}>
          Fix your connection
        </Button>
        {` to bring it back online`}
      </Typography>
    </ShowStatus>
  );
}
