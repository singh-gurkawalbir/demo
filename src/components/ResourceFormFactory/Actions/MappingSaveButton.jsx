import { withStyles } from '@material-ui/core/styles';
import { useCallback, useState, useEffect, Fragment } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import Spinner from '../../Spinner';
import { useLoadingSnackbarOnSave } from '.';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const MappingSaveButton = props => {
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
  const [enquesnackbar] = useEnqueueSnackbar();
  const { validationErrMsg } = useSelector(state =>
    selectors.mapping(state, id)
  );
  const mappingsChanged = useSelector(state =>
    selectors.mappingsChanged(state, id)
  );
  const dispatch = useDispatch();
  const { saveTerminated, saveCompleted } = useSelector(state =>
    selectors.mappingSaveProcessTerminate(state, id)
  );

  useEffect(() => {
    if (saveTrigerred && saveCompleted && onClose) {
      onClose();
      setSaveTriggered(false);
    }
  }, [onClose, saveCompleted, saveTerminated, saveTrigerred]);
  const onSave = useCallback(() => {
    dispatch(actions.mapping.save(id));
    setSaveTriggered(true);
  }, [dispatch, id]);
  const { handleSubmitForm, disableSave } = useLoadingSnackbarOnSave({
    saveTerminated,
    onSave,
    resourceType: 'mappings',
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
    return <div />;
  }

  return (
    <Button
      data-test={dataTest}
      variant={variant}
      color={color}
      disabled={disabled || !mappingsChanged}
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
};

export default withStyles(styles)(MappingSaveButton);
