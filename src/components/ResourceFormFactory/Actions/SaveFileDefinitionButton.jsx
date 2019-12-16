import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
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
const SaveFileDefinitionButton = props => {
  const {
    submitButtonLabel = 'Submit',
    resourceType,
    resourceId,
    disabled = false,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [enquesnackbar] = useEnqueueSnackbar();
  const [disableSave, setDisableSave] = useState(false);
  const saveTerminated = useSelector(state =>
    resourceFormSaveProcessTerminated(state, resourceType, resourceId)
  );
  const handleSubmitForm = values => {
    let definitionRules = values['/file/filedefinition/rules'];

    try {
      definitionRules = JSON.parse(definitionRules);

      dispatch(
        actions.fileDefinitions.definition.userDefined.save(definitionRules, {
          resourceId,
          resourceType,
          values,
        })
      );
      setDisableSave(true);
    } catch (e) {
      // Handle incase of JSON parsing error
      enquesnackbar({
        message: e,
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    if (saveTerminated) setDisableSave(false);
  }, [saveTerminated]);

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

export default SaveFileDefinitionButton;
