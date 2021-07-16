import React, { useCallback, useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import Spinner from '../../../components/Spinner';

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
  const { saveInProgress, saveCompleted, saveTerminated } = useSelector(state =>
    selectors.suiteScriptMappingSaveStatus(state), shallowEqual
  );

  const onSave = useCallback(() => {
    setSaveTriggered(true);
    dispatch(actions.suiteScript.mapping.save());
  }, [dispatch]);

  const handleButtonClick = () => {
    if (validationErrMsg) {
      enquesnackbar({
        message: validationErrMsg,
        variant: 'error',
      });

      return;
    }

    onSave();
  };

  useEffect(() => {
    if (saveTerminated) {
      setSaveTriggered(false);
    }
    if (saveCompleted && onClose) {
      onClose();
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
      disabled={disabled || saveInProgress || !mappingsChanged}
      onClick={handleButtonClick}>
      {saveInProgress ? (
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
