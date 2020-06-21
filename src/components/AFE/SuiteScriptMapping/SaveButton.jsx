import { withStyles } from '@material-ui/core/styles';
import React, { useCallback, useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Spinner from '../../Spinner';

export const useLoadingSnackbarOnSave = props => {
  const { saveTerminated, onSave } = props;
  const [disableSave, setDisableSave] = useState(false);
  const handleSubmitForm = useCallback(
    values => {
      onSave(values);
      setDisableSave(true);
    },
    [onSave]
  );

  useEffect(() => {
    if (saveTerminated) {
      setDisableSave(false);
    }
  }, [saveTerminated]);

  return { handleSubmitForm, disableSave };
};
const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const MappingSaveButton = props => {
  const {
    submitButtonLabel = 'Save',
    variant = 'outlined',
    color = 'secondary',
    disabled = false,
    dataTest,
    ssLinkedConnectionId,
    integrationId,
    flowId,
    showOnlyOnChanges,
    onClose,
  } = props;
  const [saveTrigerred, setSaveTriggered] = useState(false);
  const [enquesnackbar] = useEnqueueSnackbar();
  const { validationErrMsg } = useSelector(state =>
    selectors.suiteScriptMapping(state, {ssLinkedConnectionId, integrationId, flowId})
  );
  const mappingsChanged = useSelector(state =>
    selectors.suitesciptMappingsChanged(state, {ssLinkedConnectionId, integrationId, flowId})
  );
  const dispatch = useDispatch();
  const { saveTerminated, saveCompleted } = useSelector(state =>
    selectors.mappingsSaveStatus(state, {ssLinkedConnectionId, integrationId, flowId})
  );

  useEffect(() => {
    if (saveTrigerred && saveCompleted && onClose) {
      onClose();
      setSaveTriggered(false);
    }
  }, [onClose, saveCompleted, saveTerminated, saveTrigerred]);
  const onSave = useCallback(() => {
    dispatch(actions.suiteScriptMapping.save({ ssLinkedConnectionId,
      integrationId,
      flowId, }));
    setSaveTriggered(true);
  }, [dispatch, flowId, integrationId, ssLinkedConnectionId]);
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
  });
  const handleButtonClick = () => {
    if (validationErrMsg) {
      enquesnackbar({
        message: validationErrMsg,
        variant: 'error',
      });

      return;
    }

    handleSubmitForm();
  };

  if (showOnlyOnChanges && !mappingsChanged) {
    return null;
  }

  return (
    <Button
      data-test={dataTest}
      variant={variant}
      color={color}
      disabled={disabled || disableSave || !mappingsChanged}
      onClick={handleButtonClick}>
      {disableSave ? (
        <>
          <Spinner size={16} />
          Saving
        </>
      ) : (
        <>{submitButtonLabel}</>
      )}
    </Button>
  );
};

export default withStyles(styles)(MappingSaveButton);
