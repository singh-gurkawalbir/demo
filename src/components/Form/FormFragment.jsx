import { Fragment, useCallback } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import * as seletors from '../../reducers';
import getRenderer from '../DynaForm/renderer';

export const FieldComponent = props => {
  const { fieldState, renderer } = props;

  if (!fieldState || !fieldState.visible) return null;

  return renderer(props);
};

export default function FormFragment({ defaultFields, formKey }) {
  const dispatch = useDispatch();
  const formState = useSelector(
    state => seletors.getFormState(state, formKey),
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
      const { resourceId, resourceType } = formState;

      // i really may not need this considering metadata is generating this props
      return getRenderer(formKey, resourceId, resourceType)(field);
    },
    [formKey, formState]
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
  if (!formState) return null;

  return (
    <Fragment>
      {defaultFields.map(field => {
        // maybe .find may not be necessaery ..we can get the fieldState directly
        const fieldState = formState.fields[field.id];

        return (
          <FieldComponent
            key={field.id}
            fieldState={fieldState}
            renderer={renderer}
            onFieldChange={onFieldChange}
            onFieldBlur={onFieldBlur}
            onFieldFocus={onFieldFocus}
            formKey={formKey}
            registerField={registerField}
          />
        );
      })}
    </Fragment>
  );
}
