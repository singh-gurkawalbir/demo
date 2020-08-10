import { withStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import { selectors } from '../../../reducers';
import { useLoadingSnackbarOnSave } from '.';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const SaveAndContinueButton = props => {
  const {
    label,
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
        actions.resourceForm.saveAndContinue(
          resourceType,
          resourceId,
          values,
          match
        )
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
      {disableSave ? 'Saving' : label}
    </DynaAction>
  );
};

export default withStyles(styles)(SaveAndContinueButton);
