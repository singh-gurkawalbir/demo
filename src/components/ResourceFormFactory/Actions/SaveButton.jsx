import { withStyles } from '@material-ui/core/styles';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import * as selectors from '../../../reducers';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';

export const useLoadingSnackbarOnSave = props => {
  const { saveTerminated, onSave, resourceType } = props;
  const [disableSave, setDisableSave] = useState(false);
  const [snackbar, closeSnackbar] = useEnqueueSnackbar();
  const handleSubmitForm = useCallback(
    values => {
      onSave(values);
      setDisableSave(true);
      snackbar({
        variant: 'info',
        message: `Saving your ${MODEL_PLURAL_TO_LABEL[resourceType] ||
          resourceType} `,
        persist: true,
      });
    },
    [onSave, resourceType, snackbar]
  );

  useEffect(() => {
    if (saveTerminated) {
      setDisableSave(false);
      closeSnackbar();
    }

    return closeSnackbar;
  }, [closeSnackbar, saveTerminated]);

  return { handleSubmitForm, disableSave };
};

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const SaveButton = props => {
  const {
    submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    classes,
    match,
    disabled = false,
  } = props;
  const dispatch = useDispatch();
  const saveTerminated = useSelector(state =>
    selectors.resourceFormSaveProcessTerminated(state, resourceType, resourceId)
  );
  const onSave = useCallback(
    values => {
      dispatch(
        actions.resourceForm.submit(resourceType, resourceId, values, match)
      );
    },
    [dispatch, match, resourceId, resourceType]
  );
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
    resourceType,
  });

  return (
    <DynaAction
      {...props}
      className={classes.actionButton}
      disabled={disabled || disableSave}
      onClick={handleSubmitForm}>
      {disableSave ? 'Saving' : submitButtonLabel}
    </DynaAction>
  );
};

export default withStyles(styles)(SaveButton);
