import { Fragment, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import * as selectors from '../../reducers';
import getRenderer from '../DynaForm/renderer';

export const FieldComponent = props => {
  const { formKey, id, renderer } = props;
  const fieldState = useSelector(
    state => selectors.getFieldState(state, formKey, id),
    shallowEqual
  );

  if (!fieldState || !fieldState.visible) return null;

  return renderer({ ...props, ...props.parentContext, fieldState });
};

export default function FormFragment({ defaultFields, formKey }) {
  const dispatch = useDispatch();
  const formParentContext = useSelector(
    state => selectors.getFormParentContext(state, formKey),
    shallowEqual
  );
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
  const registerField = useCallback(
    field => dispatch(actions.form.field.registerField(formKey)(field)),
    [dispatch, formKey]
  );
  const renderer = useCallback(
    field => {
      // rest could mostly be form context such as edit mode what type of resource
      // we change this interface for getRenderer
      const { resourceId, resourceType } = formParentContext;

      // i really may not need this considering metadata is generating this props
      return getRenderer(formKey, resourceId, resourceType)(field);
    },
    [formKey, formParentContext]
  );

  // both useForm hook and the FormFragment were getting executed simultaneously
  /*

  useEffect(() => {
    defaultFields.forEach(field => {
      // if new field register
      if (!formState || !formState.fields || !formState.fields[field.id]) {
        registerField(field);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, registerField]);
*/
  // console.log('see rerender form ', formParentContext);

  return (
    <Fragment>
      {defaultFields.map(field => (
        <FieldComponent
          key={field.id}
          id={field.id}
          renderer={renderer}
          onFieldChange={onFieldChange}
          onFieldBlur={onFieldBlur}
          onFieldFocus={onFieldFocus}
          formKey={formKey}
          registerField={registerField}
        />
      ))}
    </Fragment>
  );
}
