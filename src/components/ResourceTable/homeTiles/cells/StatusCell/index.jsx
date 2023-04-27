import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../../reducers';
import { TILE_STATUS } from '../../../../../constants';
import { tileStatus, isTileStatusConnectionDown } from '../../../../../utils/home';
import actions from '../../../../../actions';
import { useSelectorMemo } from '../../../../../hooks';
import Status from '../../../../Buttons/Status';
import { getTextAfterCount } from '../../../../../utils/string';

const useStyles = makeStyles(theme => ({
  statusWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    '& > *': {
      textAlign: 'left',
      marginBottom: theme.spacing(0.5),
      alignItems: 'flex-start',
    },
  },
}));

export default function StatusCell({ tile }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    urlToIntegrationConnections,
    urlToIntegrationStatus} = useSelectorMemo(selectors.mkHomeTileRedirectUrl, tile);
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  const status = tileStatus(tile);
  const isConnectionDown = isTileStatusConnectionDown(tile);
  const connErrorsText = isConnectionDown && `${getTextAfterCount('connection', tile.offlineConnections.length)} down`;

  const handleStatusClick = useCallback(
    event => {
      event.stopPropagation();
      if (tile.status === TILE_STATUS.IS_PENDING_SETUP || isUserInErrMgtTwoDotZero) {
        history.push(urlToIntegrationStatus);
      } else {
        dispatch(
          actions.patchFilter('jobs', {
            status: status.variant === 'error' ? 'error' : 'all',
          })
        );

        history.push(urlToIntegrationStatus);
      }
    },
    [dispatch, history, isUserInErrMgtTwoDotZero, status.variant, tile.status, urlToIntegrationStatus]
  );

  const handleConnectionDownStatusClick = useCallback(event => {
    event.stopPropagation();
    history.push(urlToIntegrationConnections);
  }, [history, urlToIntegrationConnections]);

  return (
    <div className={classes.statusWrapper}>
      <Status
        variant={status.variant}
        onClick={handleStatusClick}
        >
        {status.label}
      </Status>
      {isConnectionDown && (
      <Status
        variant="error"
        onClick={handleConnectionDownStatusClick} >
        {connErrorsText}
      </Status>
      )}
    </div>
  );
}
