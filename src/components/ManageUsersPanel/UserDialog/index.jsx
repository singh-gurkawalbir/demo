import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
} from '../../../utils/constants';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import ModalDialog from '../../ModalDialog';
import UserForm from './UserForm';
import getRequestOptions from '../../../utils/requestOptions';
import useSaveStatusIndicator from '../../../hooks/useSaveStatusIndicator';

export default function UserDialog({ open, userId, onClose }) {
  const dispatch = useDispatch();
  const { path, opts } = useMemo(() => getRequestOptions(userId ? actionTypes.USER_UPDATE : actionTypes.USER_CREATE, {resourceId: userId }), [userId]);
  const handleSaveClick = useCallback(
    ({ email, accessLevel, integrationsToMonitor, integrationsToManage }) => {
      const aShareData = {
        _id: userId,
        email,
        accessLevel,
        integrationAccessLevel: [],
      };

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

  const { submitHandler, disableSave} = useSaveStatusIndicator(
    {
      path,
      method: opts.method,
      onSave: handleSaveClick,
      onClose,
    }
  );

  return (
    <>
      <ModalDialog show={open} onClose={onClose}>
        <div>{userId ? 'Change user permissions' : 'Invite user'}</div>
        <div>
          <UserForm
            id={userId}
            disableSave={disableSave}
            onSaveClick={submitHandler(true)}
            onCancelClick={onClose}
          />
        </div>
      </ModalDialog>
    </>
  );
}
