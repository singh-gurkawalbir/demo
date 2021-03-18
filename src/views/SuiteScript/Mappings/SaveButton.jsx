import React, { useCallback, useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import Spinner from '../../../components/Spinner';

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

export default function MappingSaveButton(props) {
  const {
    submitButtonLabel = 'Save',
    variant = 'outlined',
    color = 'secondary',
    disabled = false,
    dataTest,
    showOnlyOnChanges,
    onClose,
  } = props;
  const [saveTrigerred, setSaveTriggered] = useState(false);
  const [enquesnackbar] = useEnqueueSnackbar();
  const validationErrMsg = useSelector(state =>
    selectors.suiteScriptMapping(state).validationErrMsg
  );
  const mappingsChanged = useSelector(state =>
    selectors.suiteScriptMappingChanged(state)
  );
  const dispatch = useDispatch();
  const { saveTerminated, saveCompleted } = useSelector(state =>
    selectors.suiteScriptMappingSaveStatus(state), shallowEqual
  );

  const onSave = useCallback(() => {
    setSaveTriggered(true);
    dispatch(actions.suiteScript.mapping.save());
  }, [dispatch]);
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

  useEffect(() => {
    if (saveTrigerred && saveCompleted && onClose) {
      onClose();
      setSaveTriggered(false);
    }
  }, [onClose, saveCompleted, saveTerminated, saveTrigerred]);

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
          <Spinner size="small" />
          Saving
        </>
      ) : (
        <>{submitButtonLabel}</>
      )}
    </Button>
  );
}
