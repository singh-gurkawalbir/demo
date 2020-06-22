import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { resourceFormSaveProcessTerminated } from '../../../reducers';

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}));
const SaveAndCloseFileDefinitionButton = props => {
  const {
    submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    flowId,
    disabled = false,
    skipClose = false,
    disableSaveOnClick,
    setDisableSaveOnClick,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [isSaving, setIsSaving] = useState(false);
  const saveTerminated = useSelector(state =>
    resourceFormSaveProcessTerminated(state, resourceType, resourceId)
  );
  const handleSubmitForm = useCallback(
    values => {
      let definitionRules = values['/file/filedefinition/rules'];

      try {
        definitionRules = JSON.parse(definitionRules);

        dispatch(
          actions.fileDefinitions.definition.userDefined.save(
            definitionRules,
            {
              resourceId,
              resourceType,
              values,
            },
            flowId,
            skipClose,
          )
        );
        setIsSaving(true);
        setDisableSaveOnClick(true);
      } catch (e) {
        // Handle incase of JSON parsing error
        enquesnackbar({
          message:
            'Filedefinition rules provided is not a valid json, Please correct it.',
          variant: 'error',
        });
      }
    },
    [dispatch, enquesnackbar, flowId, resourceId, resourceType, skipClose, setDisableSaveOnClick]
  );

  useEffect(() => {
    if (saveTerminated) {
      setIsSaving(false);
      setDisableSaveOnClick(false);
    }
  }, [saveTerminated, setDisableSaveOnClick]);

  return (
    <DynaAction
      {...props}
      className={classes.actionButton}
      disabled={disabled || disableSaveOnClick}
      onClick={handleSubmitForm}>
      {isSaving ? 'Saving' : submitButtonLabel}
    </DynaAction>
  );
};

export default SaveAndCloseFileDefinitionButton;
