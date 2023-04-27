import { Typography } from '@mui/material';
import moment from 'moment';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import ClipboardCopy from '../../../../ClipboardCopy';

function isPurged(autoPurgeAt) {
  if (!autoPurgeAt) {
    return false;
  }

  const dtAutoPurgeAt = moment(autoPurgeAt);

  return dtAutoPurgeAt.diff(moment(), 'seconds') <= 0;
}
export default function Display({ accessToken }) {
  const dispatch = useDispatch();
  const { token } = useSelector(state =>
    selectors.apiAccessToken(state, accessToken._id)
  );

  const handleDisplayClick = useCallback(() => dispatch(actions.accessToken.displayToken(accessToken._id)), [accessToken._id, dispatch]);

  return (
    <>
      {!accessToken.permissions.displayToken && (
        <Typography>{accessToken.permissionReasons.displayToken}</Typography>
      )}
      {isPurged(accessToken.autoPurgeAt) ? (
        <Typography>Purged</Typography>
      ) : (
        <>
          {accessToken.permissions.displayToken && (
            <ClipboardCopy onShowToken={handleDisplayClick} token={token} showTokenTestAttr="displayTokenStatus" />
          )}
        </>
      )}
    </>
  );
}
