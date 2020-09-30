import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../../utils/constants';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { COMM_STATES } from '../../../reducers/comms/networkComms';
import CommStatus from '../../CommStatus';
import ModalDialog from '../../ModalDialog';
import UserForm from './UserForm';
import inferErrorMessage from '../../../utils/inferErrorMessage';

export default function UserDialog({ open, userId, onClose, onSuccess }) {
  const [errorMessage, setErrorMessage] = useState();
  const [disableSave, setDisableSave] = useState(false);
  const [actionsToClear, setActionsToClear] = useState();
  const [callSuccessCleanup, setCallSuccessCleanup] = useState(false);
  const dispatch = useDispatch();
  const handleClose = useCallback(() => {
    setErrorMessage();

    if (onClose) onClose();
  }, [onClose]);
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
          if (onSuccess) {
            setCallSuccessCleanup(true);
          }

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
    [onSuccess]
  );

  useEffect(() => {
    // this is a hack to overcome React Batching mechanism.
    // If we add onSuccess() directly in commStatusHandler, then local state like setActionsToClear was not getting set(and was removed directly
    // because onSuccess handler unmounts this component) and hence the comm status was never clearing up
    // TODO: any other better way to do this? (eg using asynchronous call, setTimeout(() => onSuccess());)

    if (callSuccessCleanup) { onSuccess(); }
  }, [callSuccessCleanup, onSuccess]);

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

      <ModalDialog show={open} onClose={handleClose}>
        <div>{userId ? 'Change user permissions' : 'Invite user'}</div>
        <div>
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
        </div>
      </ModalDialog>
    </>
  );
}
