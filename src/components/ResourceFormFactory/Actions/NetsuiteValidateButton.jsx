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
  const { message } = netsuiteUserRolesState || {};
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
    if (message) {
      enquesnackbar({ message, variant: 'error' });

      dispatch(
        actions.resource.connections.netsuite.clearUserRoles(resourceId)
      );

      if (matchingActionField) {
        onFieldChange(id, 'true');
      }
    }
  }, [
    dispatch,
    enquesnackbar,
    id,
    matchingActionField,
    message,
    onFieldChange,
    resourceId,
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
      variant="contained"
      color="secondary"
      className={classes.actionButton}
      disabled={disabled || isValidatingNetsuiteUserRoles}
      onClick={() => {
        onFieldChange(id, 'false');
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
