import { withStyles } from '@material-ui/core/styles';
import { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import { FormContext } from 'react-forms-processor/dist';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const NetsuiteValidateButton = props => {
  const dispatch = useDispatch();
  const {
    resourceId,
    classes,
    fields,
    id,
    registerField,
    visibleWhen,
    visibleWhenAll,
    value,
    disabled,
    onFieldChange,
  } = props;
  const handleValidate = values => {
    dispatch(
      actions.resource.connections.netsuite.requestUserRoles(resourceId, values)
    );
  };

  const netsuiteUserRolesState = useSelector(state =>
    selectors.netsuiteUserRoles(state, resourceId)
  );
  const isValidatingNetsuiteUserRoles = useSelector(state =>
    selectors.isValidatingNetsuiteUserRoles(state)
  );
  const { message, status } = netsuiteUserRolesState || {};
  const matchingActionField = fields.find(field => field.id === id);
  const fieldsIsVisible = matchingActionField && matchingActionField.visible;
  const [enquesnackbar] = useEnqueueSnackbar();

  useEffect(() => {
    if (resourceId && fieldsIsVisible) {
      dispatch(
        actions.resource.connections.netsuite.requestUserRoles(resourceId, null)
      );
    }
  }, [dispatch, fieldsIsVisible, resourceId]);

  useEffect(() => {
    if (fieldsIsVisible) {
      if (status === 'success') {
        // enable save button
        onFieldChange(id, 'false');
        dispatch(
          actions.resource.connections.netsuite.clearUserRoles(resourceId)
        );
      } else if (status === 'failed') {
        if (message) {
          enquesnackbar({ message, variant: 'error' });
          // disable save button
          onFieldChange(id, 'true');
          dispatch(
            actions.resource.connections.netsuite.clearUserRoles(resourceId)
          );
        }
      }
    }
  }, [
    dispatch,
    enquesnackbar,
    message,
    status,
    resourceId,
    onFieldChange,
    id,
    fieldsIsVisible,
  ]);

  useEffect(() => {
    // name does not really matter since this is an action button
    // and we are ignoring the value associated to this field
    // through omitWhenValueIs
    if (!fieldsIsVisible) {
      registerField({
        id,
        name: id,
        visibleWhen,
        visibleWhenAll,
        value: 'true',
        validWhen: { isNot: { values: ['true'] } },
        omitWhenValueIs: [undefined, 'false', 'true'],
      });
    }
  }, [registerField, fields, id, visibleWhen, visibleWhenAll, fieldsIsVisible]);

  if (id) {
    if (!fieldsIsVisible) return null;
  }

  return (
    <Button
      data-test={id}
      variant="contained"
      color="secondary"
      className={classes.actionButton}
      disabled={disabled || isValidatingNetsuiteUserRoles}
      onClick={() => {
        handleValidate(value);
      }}>
      {isValidatingNetsuiteUserRoles ? 'Validating' : 'Validate'}
    </Button>
  );
};

const FormWrappedNetsuiteValidateButton = props => (
  <FormContext.Consumer>
    {form => <NetsuiteValidateButton {...form} {...props} />}
  </FormContext.Consumer>
);

export default withStyles(styles)(FormWrappedNetsuiteValidateButton);
