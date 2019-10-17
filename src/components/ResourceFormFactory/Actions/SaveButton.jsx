import { withStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions from '../../../actions';
import DynaAction from '../../DynaForm/DynaAction';
import * as selectors from '../../../reducers';

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
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );
  const [disableSave, setDisableSave] = useState(false);
  const handleSubmitForm = values => {
    let type = resourceType;

    if (resourceType === 'connectorLicenses') {
      // construct url for licenses
      const connectorUrlStr = '/connectors/';
      const startIndex =
        match.url.indexOf(connectorUrlStr) + connectorUrlStr.length;

      if (startIndex !== -1) {
        const connectorId = match.url.substring(
          startIndex,
          match.url.indexOf('/', startIndex)
        );

        type = `connectors/${connectorId}/licenses`;
      }
    }

    dispatch(actions.resourceForm.submit(type, resourceId, values));
    setDisableSave(true);
  };

  useEffect(() => {
    if (formState.submitComplete) setDisableSave(false);
  }, [formState.submitComplete]);

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
