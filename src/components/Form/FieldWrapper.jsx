import { cloneElement } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as selectors from '../../reducers';

export default function FieldWrapper(props) {
  const { formKey, id, children, ...rest } = props;
  const fieldState = useSelector(state => {
    const formState = selectors.getFormState(state, formKey);
    const fieldState =
      formState && formState.fields.find(field => field.id === id);
    const {
      onFieldFocus,
      onFieldBlur,
      onFieldChange,
      registerField,
    } = formState;

    return {
      ...fieldState,
      onFieldFocus,
      onFieldBlur,
      onFieldChange,
      registerField,
    };
  }, shallowEqual);

  return cloneElement(children, {
    ...rest,
    ...fieldState,
  });
}
