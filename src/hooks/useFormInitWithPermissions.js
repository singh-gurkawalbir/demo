import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import useForm from '../components/Form';
import * as selectors from '../reducers';
import { fieldIDsExceptClockedFields } from '../forms/utils';
import actions from '../actions';

export default function useFormInitWithPermissions(props) {
  const dispatch = useDispatch();
  const { resourceType, resourceId, integrationId, disabled } = props;
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );
  // pass in the integration Id to find access level of its associated forms
  const { disableAllFields, disableAllFieldsExceptClocked } = useSelector(
    state =>
      selectors.formAccessLevel(state, integrationId, resource, disabled),
    shallowEqual
  );
  const formKey = useForm({ ...props, disabled: disableAllFields });
  const { fieldsMeta } = props;

  useEffect(() => {
    if (disableAllFieldsExceptClocked && formKey) {
      fieldIDsExceptClockedFields(fieldsMeta, resourceType).forEach(fieldId => {
        fieldId &&
          dispatch(
            actions.form.forceFieldState(formKey)(fieldId, undefined, true)
          );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    disableAllFieldsExceptClocked,
    dispatch,
    // TODO: it should be sensitive to metadata
    formKey,
    resourceType,
  ]);

  return formKey;
}
