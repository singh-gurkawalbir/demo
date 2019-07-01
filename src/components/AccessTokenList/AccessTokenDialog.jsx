import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import AccessTokenForm from './AccessTokenForm';
import { COMM_STATES } from '../../reducers/comms';
import CommStatus from '../CommStatus';
import * as selectors from '../../reducers';
import LoadResources from '../LoadResources';

export default function AccessTokenDialog(props) {
  const {
    id,
    integrationId,
    connectorId,
    successHandler,
    handleCancelClick,
  } = props;
  const dispatch = useDispatch();
  const accessTokens = useSelector(state =>
    selectors.accessTokenList(state, integrationId)
  );
  const [errorMessage, setErrorMessage] = useState(null);

  function saveAccessToken(data) {
    if (data._id) {
      dispatch(actions.accessToken.update(data));
    } else {
      dispatch(actions.accessToken.create(data));
    }
  }

  function handleSaveClick(data) {
    const accessTokenData = {
      ...data,
      _id: id,
      _integrationId: integrationId,
      _connectorId: connectorId,
    };

    if (accessTokenData.scope === 'fullAccess') {
      accessTokenData.fullAccess = true;
      delete accessTokenData._connectionIds;
      delete accessTokenData._exportIds;
      delete accessTokenData._importIds;
    } else {
      accessTokenData.fullAccess = false;
    }

    if (accessTokenData.autoPurgeAt === 'never') {
      accessTokenData.autoPurgeAt = '';
    } else if (accessTokenData.autoPurgeAt) {
      const autoPurgeParts = accessTokenData.autoPurgeAt.split('-');
      const currDate = moment();

      currDate.add(autoPurgeParts[0], autoPurgeParts[1]);
      accessTokenData.autoPurgeAt = currDate.toISOString();
    } else if (id) {
      const existingData = accessTokens.find(at => at._id === id);

      if (existingData.autoPurgeAt) {
        accessTokenData.autoPurgeAt = existingData.autoPurgeAt;
      }
    }

    if (!accessTokenData.autoPurgeAt) {
      delete accessTokenData.autoPurgeAt;
    }

    saveAccessToken(accessTokenData);
  }

  return (
    <LoadResources required resources="connections, exports, imports">
      <Fragment>
        <CommStatus
          actionsToMonitor={{
            createOrUpdate: {
              action: id
                ? actionTypes.ACCESSTOKEN_UPDATE
                : actionTypes.ACCESSTOKEN_CREATE,
              resourceId: id,
              integrationId,
            },
          }}
          commStatusHandler={objStatus => {
            if (
              objStatus &&
              objStatus.createOrUpdate &&
              [COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(
                objStatus.createOrUpdate.status
              )
            ) {
              if (objStatus.createOrUpdate.status === COMM_STATES.SUCCESS) {
                setErrorMessage(null);
                successHandler(
                  id
                    ? 'Access token updated successfully'
                    : 'Access token created successfully'
                );
              } else if (
                objStatus.createOrUpdate.status === COMM_STATES.ERROR
              ) {
                setErrorMessage(objStatus.createOrUpdate.message);
              }
            }
          }}
        />

        <Dialog open maxWidth={false}>
          <DialogTitle>{id ? 'Edit API Token' : 'New API Token'}</DialogTitle>
          <DialogContent style={{ width: '30vw' }}>
            <Typography>{errorMessage}</Typography>
            <AccessTokenForm
              id={id}
              integrationId={integrationId}
              onSaveClick={data => {
                handleSaveClick(data);
              }}
              onCancelClick={() => {
                handleCancelClick();
              }}
            />
          </DialogContent>
        </Dialog>
      </Fragment>
    </LoadResources>
  );
}
