import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import { selectors } from '../../../reducers';
import trim from '../../../utils/trim';
import useFormContext from '../../Form/FormContext';

const styles = theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
});
const NetsuiteValidateButton = props => {
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const {
    resourceId,
    classes,
    id,
    visibleWhen,
    visibleWhenAll,
    formKey,
  } = props;

  const { fields, disabled: formDisabled, value } = useFormContext(formKey) || {};
  const { disabled = formDisabled } = props;
  const onFieldChange = useCallback(
    (fieldId, value, skipFieldTouched) =>
      dispatch(
        actions.form.fieldChange(formKey)(fieldId, value, skipFieldTouched)
      ),
    [dispatch, formKey]
  );
  const registerField = useCallback(
    field => dispatch(actions.form.registerField(formKey)(field)),
    [dispatch, formKey]
  );
  const handleValidate = values => {
    // clear the ping comm status first as validity will be determined by netsuite user roles
    dispatch(actions.resource.connections.testClear(resourceId));
    dispatch(
      actions.resource.connections.netsuite.requestUserRoles(resourceId, values, false)
    );
  };

  const { status, message, isInvokedDuringFormInit } = useSelector(state =>
    selectors.netsuiteUserRoles(state, resourceId) || {}
  );
  const isValidatingNetsuiteUserRoles = useSelector(state =>
    selectors.isValidatingNetsuiteUserRoles(state)
  );
  const isOffline = useSelector(state =>
    selectors.isConnectionOffline(state, resourceId)
  );
  const matchingActionField = fields && Object.values(fields)?.find(field => field.id === id);
  const fieldsIsVisible = matchingActionField && matchingActionField.visible;

  useEffect(() => {
    if (resourceId && fieldsIsVisible && !isOffline) {
      dispatch(
        actions.resource.connections.netsuite.requestUserRoles(resourceId, null, true)
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, fieldsIsVisible, resourceId]);

  useEffect(() => {
    if (fieldsIsVisible) {
      if (status === 'success') {
        // enable save button
        onFieldChange(id, 'false', true);
      } else if (status === 'error') {
        if (message) {
          enquesnackbar({ message, variant: 'error' });
          // disable save button
          onFieldChange(id, 'true', true);
        }
      }
    }
  }, [status, id, fieldsIsVisible, enquesnackbar, message, onFieldChange]);

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
  }, [fields, id, visibleWhen, visibleWhenAll, fieldsIsVisible, registerField]);

  // Clean up action on un mount , to clear user roles when container is closed
  // TODO @Raghu: check ,should we clear on validate click? or on un mount?
  useEffect(() => () => dispatch(
    actions.resource.connections.netsuite.clearUserRoles(resourceId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);
  if (!fields) return null;

  if (id) {
    if (!fieldsIsVisible) return null;
  }

  return (
    <Button
      data-test={id}
      variant="outlined"
      color="secondary"
      className={classes.actionButton}
      disabled={disabled || isValidatingNetsuiteUserRoles}
      onClick={() => {
        handleValidate(trim(value));
      }}>
      {(isValidatingNetsuiteUserRoles && !isInvokedDuringFormInit) ? 'Testing' : 'Test Connection'}
    </Button>
  );
};

export default withStyles(styles)(NetsuiteValidateButton);
