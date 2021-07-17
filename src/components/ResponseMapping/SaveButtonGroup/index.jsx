import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../actions';
import {selectors} from '../../../reducers';
import SaveAndCloseButtonGroupAuto from '../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import { FORM_SAVE_STATUS } from '../../../utils/constants';
import { responseMappingsFormKey } from '../Drawer';

export default function SaveButtonGroup({ onClose }) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const saveInProgress = useSelector(
    state => selectors.responseMappingSaveStatus(state).saveInProgress
  );
  const mappingsChanged = useSelector(state =>
    selectors.responseMappingChanged(state)
  );
  const status = saveInProgress && FORM_SAVE_STATUS.LOADING;
  const onSave = useCallback(() => {
    dispatch(actions.responseMapping.save({ match }));
  }, [dispatch, match]);

  return (
    <>
      <SaveAndCloseButtonGroupAuto
        isDirty={mappingsChanged}
        status={status}
        onSave={onSave}
        onClose={onClose}
        shouldHandleCancel
        formKey={responseMappingsFormKey}
        />
    </>
  );
}
