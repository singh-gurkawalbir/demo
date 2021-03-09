
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import { selectors } from '../../../../reducers';
import { COMM_STATES } from '../../../../reducers/comms/networkComms';
import { LoadingMask } from '../../../../views/RecycleBin';
import useConfirmDialog from '../../../ConfirmDialog';
import DynaCheckbox from '../checkbox/DynaCheckbox';

const emptyObj = {};
export default function DynaFeatureCheck(props) {
  const dispatch = useDispatch();
  const { ssLinkedConnectionId, _integrationId: integrationId, featureName, onFieldChange: fieldChange, id, value, featureDisabledMessage} = props;
  const {status, message} = useSelector(state => selectors.suiteScriptIAFeatureCheckState(state, { ssLinkedConnectionId, integrationId, featureName})) || emptyObj;
  const [enquesnackbar] = useEnqueueSnackbar();
  const {confirmDialog} = useConfirmDialog();

  useEffect(() => () => {
    dispatch(actions.suiteScript.featureCheck.clear(ssLinkedConnectionId, integrationId, featureName));
  }, [dispatch, featureName, integrationId, ssLinkedConnectionId]);

  useEffect(() => {
    if (status === COMM_STATES.ERROR && !!value) {
      enquesnackbar({
        message,
        variant: 'error',
      });
      fieldChange(id, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enquesnackbar, message, status, id, value]);

  const onFieldChange = useCallback((id, value) => {
    if (value) {
      fieldChange(id, value);
      dispatch(actions.suiteScript.featureCheck.request(ssLinkedConnectionId, integrationId, featureName));
    } else {
      if (featureDisabledMessage) {
        return confirmDialog({
          title: 'Confirm',
          message: featureDisabledMessage,
          buttons: [
            {
              label: 'No',
              color: 'secondary',
            },
            {
              label: 'Yes',
              onClick: () => {
                fieldChange(id, value);
              },
            },
          ],
        });
      }
      fieldChange(id, value);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, featureName, integrationId, ssLinkedConnectionId]);

  if (status === COMM_STATES.LOADING) {
    return (
      <LoadingMask message="Checking feature..." />);
  }

  return (
    <DynaCheckbox {...props} onFieldChange={onFieldChange} />
  );
}
