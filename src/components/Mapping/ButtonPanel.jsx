import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../actions';
import {selectors} from '../../reducers';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { MAPPINGS_FORM_KEY } from '../../constants';
import SaveAndCloseButtonGroupAuto from '../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import mappingUtil from '../../utils/mapping';
import ActionGroup from '../ActionGroup';
import { OutlinedButton } from '../Buttons';

const useStyles = makeStyles({
  previewButton: {
    float: 'right',
  },
});

export default function ButtonPanel({importId, disabled, onClose}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const { validationErrMsg, saveStatus } = useSelector(
    state => selectors.mapping(state)
  );
  const isNSAssistantFormLoaded = useSelector(state => selectors.mapping(state).isNSAssistantFormLoaded);
  const mappingPreviewType = useSelector(state =>
    selectors.mappingPreviewType(state, importId)
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

  const handlePreviewClick = useCallback(() => {
    dispatch(actions.mapping.requestPreview());
  }, [dispatch]);
  const showPreviewButton = !!(mappingPreviewType === 'netsuite'
    ? isNSAssistantFormLoaded
    : mappingPreviewType);

  const formStatus = mappingUtil.getFormStatusFromMappingSaveStatus(saveStatus);

  return (
    <>
      <ActionGroup>
        <SaveAndCloseButtonGroupAuto
          isDirty={mappingsChanged}
          disabled={disabled}
          status={formStatus}
          onSave={handleSaveClick}
          onClose={onClose}
          asyncKey={MAPPINGS_FORM_KEY}
          shouldHandleCancel
        />
        {showPreviewButton && (
        <OutlinedButton
          data-test="preview"
          className={classes.previewButton}
          disabled={disabled || saveStatus === 'inProgress'}
          onClick={handlePreviewClick}>
          Preview
        </OutlinedButton>
        )}
      </ActionGroup>
    </>
  );
}
