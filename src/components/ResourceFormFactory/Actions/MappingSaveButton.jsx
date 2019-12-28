import { withStyles } from '@material-ui/core/styles';
import { useCallback } from 'react';
import { Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
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
  } = props;
  const [enquesnackbar] = useEnqueueSnackbar();
  const { validationErrMsg } = useSelector(state =>
    selectors.mapping(state, id)
  );
  const dispatch = useDispatch();
  const saveTerminated = useSelector(state =>
    selectors.mappingSaveProcessTerminate(state, id)
  );
  const onSave = useCallback(() => {
    dispatch(actions.mapping.save(id));
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

  return (
    <Button
      data-test={dataTest}
      variant={variant}
      color={color}
      // className={className}
      disabled={disabled}
      // onClick={handleSubmitForm}
      onClick={handleButtonClick}>
      {disableSave ? 'Saving' : submitButtonLabel}
    </Button>
  );
};

export default withStyles(styles)(MappingSaveButton);
