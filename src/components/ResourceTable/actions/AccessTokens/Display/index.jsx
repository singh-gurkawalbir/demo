import { Fragment, useState } from 'react';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Typography, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import CommStatus from '../../../../../components/CommStatus';
import actionTypes from '../../../../../actions/types';
import * as selectors from '../../../../../reducers';

export default function Display({ accesstoken }) {
  // console.log(`at -- ${JSON.stringify(accesstoken)}`);
  const dispatch = useDispatch();
  const [tokenStatus, setTokenStatus] = useState(null);
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { token } = useSelector(state =>
    selectors.apiAccessToken(state, accesstoken._id)
  );

  function handleDisplayClick() {
    setTokenStatus('Getting Token...');

    return dispatch(actions.accessToken.displayToken(accesstoken._id));
  }

  function isPurged(autoPurgeAt) {
    if (!autoPurgeAt) {
      return false;
    }

    const dtAutoPurgeAt = moment(autoPurgeAt);

    return dtAutoPurgeAt.diff(moment(), 'seconds') <= 0;
  }

  function commStatusHandler() {
    setTokenStatus(null);
  }

  return (
    <Fragment>
      <CommStatus
        actionsToMonitor={{
          displayToken: {
            action: actionTypes.ACCESSTOKEN_TOKEN_DISPLAY,
            resourceId: accesstoken._id,
          },
        }}
        autoClearOnComplete
        commStatusHandler={objStatus => {
          commStatusHandler(objStatus);
        }}
      />
      {!accesstoken.permissions.displayToken && (
        <Typography>{accesstoken.permissionReasons.displayToken}</Typography>
      )}
      {isPurged(accesstoken.autoPurgeAt) ? (
        <Typography>Purged</Typography>
      ) : (
        <Fragment>
          {accesstoken.permissions.displayToken && (
            <Fragment>
              {token && (
                <Fragment>
                  <Typography>{token}</Typography>
                  <CopyToClipboard
                    text={token}
                    onCopy={() =>
                      enqueueSnackbar({
                        message: 'Token copied to clipboard.',
                        variant: 'success',
                      })
                    }>
                    <Button>Click to Copy</Button>
                  </CopyToClipboard>
                </Fragment>
              )}
              {!token &&
                (tokenStatus || (
                  <Button
                    onClick={() => {
                      handleDisplayClick('display');
                    }}>
                    Click to Display
                  </Button>
                ))}
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
