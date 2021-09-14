import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import UserForm from './UserForm';
import {
  USER_ACCESS_LEVELS,
  INTEGRATION_ACCESS_LEVELS,
  INVITE_USER_DRAWER_FORM_KEY,
} from '../../../utils/constants';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { COMM_STATES } from '../../../reducers/comms/networkComms';
import useCommStatus from '../../../hooks/useCommStatus';

export default function UserFormWrapper({ userId, dataPublic }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [actionsToClear, setActionsToClear] = useState();
  const [disableSave, setDisableSave] = useState(false);
  const handleSaveClick = useCallback(
    ({ email, accessLevel, integrationsToMonitor, integrationsToManage, accountSSORequired }) => {
      const aShareData = {
        _id: userId,
        email,
        accessLevel,
        integrationAccessLevel: [],
        accountSSORequired,
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
        dispatch(actions.user.org.users.update(aShareData._id, aShareData, INVITE_USER_DRAWER_FORM_KEY));
      } else {
        dispatch(actions.user.org.users.create(aShareData, INVITE_USER_DRAWER_FORM_KEY));
      }
      setDisableSave(true);
    },
    [userId, dispatch]
  );

  const handleClose = useCallback(() => history.goBack(), [history]);

  const commStatusHandler = useCallback(
    objStatus => {
      if (
        objStatus?.createOrUpdate &&
        [COMM_STATES.SUCCESS, COMM_STATES.ERROR].includes(objStatus.createOrUpdate.status) &&
        disableSave
      ) {
        setActionsToClear(['createOrUpdate']);
        setDisableSave(false);
        if (objStatus.createOrUpdate.status === COMM_STATES.SUCCESS) {
          handleClose();
        }
      }
    },
    [handleClose, disableSave]
  );

  const actionsToMonitor = useMemo(() => ({
    createOrUpdate: {
      action: userId ? actionTypes.USER_UPDATE : actionTypes.USER_CREATE,
      resourceId: userId,
    },
  }), [userId]);

  useCommStatus({actionsToClear, actionsToMonitor, commStatusHandler});

  return (
    <UserForm
      id={userId}
      dataPublic={dataPublic}
      onSaveClick={handleSaveClick}
      onCancelClick={handleClose}
    />
  );
}
