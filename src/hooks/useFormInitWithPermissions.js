import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import useForm from '../components/Form';
import { selectors } from '../reducers';
import { fieldIDsExceptClockedFields } from '../forms/formFactory/utils';
import actions from '../actions';

export default function useFormInitWithPermissions(props) {
  const dispatch = useDispatch();
  const { resourceType, resourceId, integrationId, disabled, skipMonitorLevelAccessCheck, fieldMeta } = props;
  const resource = useSelector(state => selectors.resource(state, resourceType, resourceId));
  // pass in the integration Id to find access level of its associated forms
  const { disableAllFields, disableAllFieldsExceptClocked } = useSelector(
    state =>
      skipMonitorLevelAccessCheck ? {disableAllFields: false, disableAllFieldsExceptClocked: false}
        : selectors.formAccessLevel(state, integrationId, resource, disabled),
    shallowEqual
  );
  const formKey = useForm({ ...props, disabled: disableAllFields });

  useEffect(() => {
    let disableFields;

    if (formKey && disableAllFieldsExceptClocked) {
      disableFields = fieldIDsExceptClockedFields(fieldMeta, resourceType);

      disableFields && disableFields.forEach(id => {
        dispatch(
          actions.form.forceFieldState(formKey)(id, {disabled: true})
        );
      });
    }

    return () => {
      // cleanup remove all force computations associated to disableFields
      if (formKey && disableAllFieldsExceptClocked && disableFields) {
        disableFields.forEach(id => {
          dispatch(
            actions.form.clearForceFieldState(formKey)(id)
          );
        });
      }
    };
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
