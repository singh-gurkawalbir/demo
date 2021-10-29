import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../actions';
import {selectors} from '../../../reducers';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import SaveAndCloseButtonGroupAuto from '../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import mappingUtil from '../../../utils/mapping';
import ActionGroup from '../../ActionGroup';

export default function ButtonPanel({ editorId, onClose }) {
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
