import { withStyles } from '@material-ui/core/styles';
import React, { useCallback, useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import * as selectors from '../../reducers';
import Spinner from '../Spinner';
import { useLoadingSnackbarOnSave } from '../ResourceFormFactory/Actions';

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
    showOnlyOnChanges,
    onClose,
  } = props;
  const [saveTrigerred, setSaveTriggered] = useState(false);
  const [disableSaveOnClick, setDisableSaveOnClick] = useState(false);
  const [enquesnackbar] = useEnqueueSnackbar();
  const { validationErrMsg } = useSelector(state =>
    selectors.mappingV2(state)
  );
  const mappingsChanged = useSelector(state =>
    selectors.mappingV2Changed(state)
  );
  const dispatch = useDispatch();
  const { saveTerminated, saveCompleted } = useSelector(state =>
    selectors.mappingV2SaveStatus(state)
  );

  useEffect(() => {
    if (saveTrigerred && saveCompleted && onClose) {
      onClose();
      setSaveTriggered(false);
    }
  }, [onClose, saveCompleted, saveTerminated, saveTrigerred]);
  const onSave = useCallback(() => {
    dispatch(actions.mappingV2.save());
    setSaveTriggered(true);
  }, [dispatch]);
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
    resourceType: 'mappings',
    disableSaveOnClick,
    setDisableSaveOnClick,
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
