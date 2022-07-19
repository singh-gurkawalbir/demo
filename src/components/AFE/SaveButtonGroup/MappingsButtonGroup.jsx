import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../actions';
import {selectors} from '../../../reducers';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import SaveAndCloseButtonGroupAuto from '../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import mappingUtil from '../../../utils/mapping';
import ActionGroup from '../../ActionGroup';
import { FORM_SAVE_STATUS } from '../../../constants';

function ResponseMappingsButtonGroup({ editorId, onClose }) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const saveInProgress = useSelector(
    state => selectors.responseMappingSaveStatus(state).saveInProgress
  );
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const mappingsChanged = useSelector(state =>
    selectors.responseMappingChanged(state)
  );
  const status = saveInProgress ? FORM_SAVE_STATUS.LOADING : FORM_SAVE_STATUS.COMPLETE;
  const onSave = useCallback(() => {
    dispatch(actions.responseMapping.save({ match }));
  }, [dispatch, match]);

  return (
    <SaveAndCloseButtonGroupAuto
      isDirty={mappingsChanged}
      disabled={disabled}
      status={status}
      onSave={onSave}
      onClose={onClose}
      shouldHandleCancel
      asyncKey={editorId}
    />
  );
}

function ImportMappingsButtonGroup({ editorId, onClose }) {
  const match = useRouteMatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const { validationErrMsg, saveStatus } = useSelector(
    state => selectors.mapping(state)
  );
  const mappingsChanged = useSelector(state => selectors.mappingChanged(state));

  const handleSaveClick = useCallback(() => {
    if (validationErrMsg) {
      enqueueSnackbar({
        message: validationErrMsg,
        variant: 'error',
      });

      return;
    }

    dispatch(actions.mapping.save({ match }));
  }, [dispatch, enqueueSnackbar, match, validationErrMsg]);

  const formStatus = mappingUtil.getFormStatusFromMappingSaveStatus(saveStatus);

  return (
    <ActionGroup>
      <SaveAndCloseButtonGroupAuto
        isDirty={mappingsChanged}
        disabled={disabled}
        status={formStatus}
        onSave={handleSaveClick}
        onClose={onClose}
        asyncKey={editorId}
        shouldHandleCancel
        />
    </ActionGroup>
  );
}

export default function ButtonWrapper({editorId, onClose}) {
  const editorType = useSelector(state => selectors.editor(state, editorId).editorType);

  return editorType === 'mappings' ? (
    <ImportMappingsButtonGroup
      editorId={editorId}
      onClose={onClose} />
  )
    : (
      <ResponseMappingsButtonGroup
        editorId={editorId}
        onClose={onClose} />
    );
}
