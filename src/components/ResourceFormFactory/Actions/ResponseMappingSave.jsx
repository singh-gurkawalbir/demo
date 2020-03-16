import { useCallback, useState, useEffect, Fragment } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Spinner from '../../Spinner';
import { useLoadingSnackbarOnSave } from '.';

// TODO: Handle errors
export default function ResponseMappingSave(props) {
  const {
    id,
    submitButtonLabel = 'Save',
    variant = 'outlined',
    color = 'secondary',
    disabled = false,
    dataTest,
    showOnlyOnChanges,
    onClose,
  } = props;
  const [saveTrigerred, setSaveTriggered] = useState(false);
  const dispatch = useDispatch();
  const { saveTerminated, saveCompleted } = useSelector(state =>
    selectors.responseMappingSaveStatus(state, id)
  );
  const isDirty = useSelector(state =>
    selectors.responseMappingDirty(state, id)
  );

  useEffect(() => {
    if (saveTrigerred && saveCompleted && onClose) {
      onClose();
      setSaveTriggered(false);
    }
  }, [onClose, saveCompleted, saveTerminated, saveTrigerred]);
  const onSave = useCallback(() => {
    dispatch(actions.responseMapping.save(id));
    setSaveTriggered(true);
  }, [dispatch, id]);
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
  });
  const handleButtonClick = () => {
    handleSubmitForm();
  };

  if (showOnlyOnChanges && !isDirty) {
    return null;
  }

  return (
    <Button
      data-test={dataTest}
      variant={variant}
      color={color}
      disabled={disabled || disableSave || !isDirty}
      onClick={handleButtonClick}>
      {disableSave ? (
        <Fragment>
          <Spinner size={16} />
          Saving
        </Fragment>
      ) : (
        <Fragment>{submitButtonLabel}</Fragment>
      )}
    </Button>
  );
}
