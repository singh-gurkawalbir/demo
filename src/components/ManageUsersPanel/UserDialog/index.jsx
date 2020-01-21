import { Fragment, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../../utils/constants';
import actions from '../../../actions';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actionTypes from '../../../actions/types';
import { COMM_STATES } from '../../../reducers/comms/networkComms';
import CommStatus from '../../CommStatus';
import ModalDialog from '../../ModalDialog';
import UserForm from './UserForm';

export default function UserDialog({ open, userId, onClose, onSuccess }) {
  const [errorMessage, setErrorMessage] = useState();
  const [actionsToClear, setActionsToClear] = useState();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
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

      if (accessLevel === USER_ACCESS_LEVELS.TILE) {
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
          enqueueSnackbar({
            message: userId
              ? 'User updated successfully'
              : 'User invited successfully',
          });

          if (onSuccess) onSuccess();

          setErrorMessage();
        } else if (objStatus.createOrUpdate.status === COMM_STATES.ERROR) {
          setErrorMessage(objStatus.createOrUpdate.message);
        }

        setActionsToClear(['createOrUpdate']);
      }
    },
    [enqueueSnackbar, onSuccess, userId]
  );

  return (
    <Fragment>
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
        <div>{userId ? 'Change user permissions' : 'Invite users'}</div>
        <div>
          {errorMessage && (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          )}
          <UserForm
            id={userId}
            onSaveClick={handleSaveClick}
            onCancelClick={handleClose}
          />
        </div>
      </ModalDialog>
    </Fragment>
  );
}
