import Button from '@material-ui/core/Button';
import { makeStyles} from '@material-ui/core/styles';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import actions from '../../../../../actions';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';
import { selectors } from '../../../../../reducers';
import useFormContext from '../../../../Form/FormContext';

const useStyles = makeStyles(theme => ({
  actionButton: {
    marginTop: theme.spacing.double,
    marginLeft: theme.spacing.double,
  },
}));

export default function NetsuiteValidateButton(props) {
  const dispatch = useDispatch();
  const [enquesnackbar] = useEnqueueSnackbar();
  const {
    resourceId,
    id,
    visibleWhen,
    visibleWhenAll,
    formKey,
  } = props;
  const classes = useStyles();

  const { fields, disabled: formDisabled } = useFormContext(formKey) || {};
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
  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const handleValidate = () => {
    // clear the ping comm status first as validity will be determined by netsuite user roles
    dispatch(actions.resource.connections.testClear(resourceId));
    dispatch(actions.resource.connections.netsuite.clearUserRoles(resourceId));
    dispatch(
      actions.resource.connections.netsuite.testConnection(resourceId, values)
    );
  };

  const { status, message, hideNotificationMessage } = useSelector(state =>
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
        actions.resource.connections.netsuite.requestUserRoles(resourceId, null)
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
      onClick={handleValidate}>
      {(isValidatingNetsuiteUserRoles && !hideNotificationMessage) ? 'Testing' : 'Test Connection'}
    </Button>
  );
}

