import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import UserForm from './UserForm';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../../utils/constants';
import actions from '../../../actions';
import inferErrorMessage from '../../../utils/inferErrorMessage';
import actionTypes from '../../../actions/types';
import { COMM_STATES } from '../../../reducers/comms/networkComms';
import CommStatus from '../../CommStatus';

export default function UserFormWrapper({ userId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState();
  const [actionsToClear, setActionsToClear] = useState();
  const [disableSave, setDisableSave] = useState(false);
  const handleSaveClick = useCallback(
    ({ email, accessLevel, integrationsToMonitor, integrationsToManage }) => {
      const aShareData = {
        _id: userId,
        email,
        accessLevel,
        integrationAccessLevel: [],
      };

      setDisableSave(true);

      if (accessLevel === USER_ACCESS_LEVELS.ACCOUNT_MONITOR) {
        integrationsToManage.forEach(_integrationId =>
          aShareData.integrationAccessLevel.push({
            _integrationId,
            accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
          })
        );
      } else if (accessLevel === USER_ACCESS_LEVELS.TILE) {
        aShareData.accessLevel = undefined;
        integrationsToManage.forEach(_integrationId =>
          aShareData.integrationAccessLevel.push({
            _integrationId,
            accessLevel: INTEGRATION_ACCESS_LEVELS.MANAGE,
          })
        );
        integrationsToMonitor.forEach(_integrationId => {
          if (!integrationsToManage.includes(_integrationId)) {
            aShareData.integrationAccessLevel.push({
              _integrationId,
              accessLevel: INTEGRATION_ACCESS_LEVELS.MONITOR,
            });
          }
        });
      }

      if (aShareData._id) {
        dispatch(actions.user.org.users.update(aShareData._id, aShareData));
      } else {
        dispatch(actions.user.org.users.create(aShareData));
      }
    },
    [userId, dispatch]
  );

  const handleClose = useCallback(() => history.goBack(), [history]);

  const commStatusHandler = useCallback(
    objStatus => {
      if (
        objStatus &&
        objStatus.createOrUpdate &&
        [COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(
          objStatus.createOrUpdate.status
        )
      ) {
        if (objStatus.createOrUpdate.status === COMM_STATES.SUCCESS) {
          handleClose();

          setErrorMessage();
        } else if (objStatus.createOrUpdate.status === COMM_STATES.ERROR) {
          setErrorMessage(
            inferErrorMessage(objStatus.createOrUpdate.message)[0]
          );
        }

        setActionsToClear(['createOrUpdate']);
        setDisableSave(false);
      }
    },
    [handleClose]
  );

  return (
    <>
      <CommStatus
        actionsToMonitor={{
          createOrUpdate: {
            action: userId ? actionTypes.USER_UPDATE : actionTypes.USER_CREATE,
            resourceId: userId,
          },
        }}
        actionsToClear={actionsToClear}
        commStatusHandler={commStatusHandler}
      />
      {errorMessage && (
      <Typography color="error" variant="body2">
        {errorMessage}
      </Typography>
      )}
      <UserForm
        id={userId}
        disableSave={disableSave}
        onSaveClick={handleSaveClick}
        onCancelClick={handleClose}
    />
    </>
  );
}
