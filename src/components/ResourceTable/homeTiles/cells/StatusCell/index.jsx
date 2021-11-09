import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../../../../reducers';
import { TILE_STATUS } from '../../../../../utils/constants';
import { tileStatus, isTileStatusConnectionDown } from '../../../../../utils/home';
import actions from '../../../../../actions';
import { useSelectorMemo } from '../../../../../hooks';
import Status from '../../../../Buttons/Status';

// todo: ashu css

export default function StatusCell({ tile }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    urlToIntegrationConnections,
    urlToIntegrationStatus} = useSelectorMemo(selectors.homeTileRedirectUrl, tile);
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  const status = tileStatus(tile);
  const isConnectionDown = isTileStatusConnectionDown(tile);
  const connErrorsText = isConnectionDown && `${tile.offlineConnections.length} connection${tile.offlineConnections.length === 1 ? '' : 's'} down`;

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
    <>
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
    </>
  );
}
