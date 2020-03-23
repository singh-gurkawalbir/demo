import { cloneElement, useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from '../../actions';
import * as selectors from '../../reducers';

export default function FieldWrapper(props) {
  const { formKey, id, children, ...rest } = props;
  const fieldState = useSelector(state => {
    const { fields } = selectors.getFormState(state, formKey);

    return fields.find(field => field.id === id);
  }, shallowEqual);
  const dispatch = useDispatch();
  const onFieldChange = useCallback(
    (fieldId, value) =>
      dispatch(actions.form.field.onFieldChange(formKey)(fieldId, value)),
    [dispatch, formKey]
  );
  const onFieldBlur = useCallback(
    fieldId => dispatch(actions.form.field.onFieldBlur(formKey)(fieldId)),
    [dispatch, formKey]
  );
  const onFieldFocus = useCallback(
    fieldId => dispatch(actions.form.field.onFieldFocus(formKey)(fieldId)),
    [dispatch, formKey]
  );

  return cloneElement(children, {
    ...rest,
    ...fieldState,
    onFieldChange,
    onFieldBlur,
    onFieldFocus,
  });
}
