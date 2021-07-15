import React, { useCallback } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import ButtonGroup from '../ButtonGroup';
import actions from '../../actions';
import {selectors} from '../../reducers';
import SaveAndCloseButtonGroup from '../SaveAndCloseButtonGroup';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import { FORM_SAVE_STATUS } from '../../utils/constants';
import useHandleCancelBasic from '../SaveAndCloseButtonGroup/hooks/useHandleCancelBasic';

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

  const formStatus = saveStatus === 'requested'
    ? FORM_SAVE_STATUS.LOADING
    : FORM_SAVE_STATUS.COMPLETE;

  const handleClose = useHandleCancelBasic({isDirty: mappingsChanged, onClose, handleSave: handleSaveClick});

  return (
    <>
      <ButtonGroup>
        <SaveAndCloseButtonGroup
          isDirty={mappingsChanged}
          disabled={disabled}
          status={formStatus}
          onSave={handleSaveClick}
          onClose={handleClose}
        />
        {showPreviewButton && (
        <Button
          variant="outlined"
          color="primary"
          data-test="preview"
          className={classes.previewButton}
          disabled={disabled || saveStatus === 'inProgress'}
          onClick={handlePreviewClick}>
          Preview
        </Button>
        )}
      </ButtonGroup>
    </>
  );
}
