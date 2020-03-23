import { Fragment, useCallback, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import * as seletors from '../../reducers';
import getRenderer from '../DynaForm/renderer';

export const FieldComponent = ({ fieldState, renderer }) => {
  if (!fieldState.visible) return null;

  return renderer(fieldState);
};

export default function FormFragment({ defaultFields, formKey }) {
  const dispatch = useDispatch();
  const formState = useSelector(
    state => seletors.getFormState(state, formKey),
    shallowEqual
  );
  const renderer = useCallback(
    field => {
      const { fields, value, ...rest } = formState;
      // rest could mostly be form context such as edit mode what type of resource
      // we change this interface for getRenderer
      const { editMode, formFieldsMeta, resourceId, resourceType } = rest;

      // i really may not need this considering metadata is generating this props
      return getRenderer(
        formKey,
        editMode,
        formFieldsMeta,
        resourceId,
        resourceType
      )(field);
    },
    [formKey, formState]
  );

  useEffect(() => {
    defaultFields.forEach(field => {
      // if new field register
      if (
        !formState ||
        !formState.fields ||
        !formState.fields.some(f => f.id === field.id)
      ) {
        dispatch(actions.form.field.registerField(formKey)(field));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, formKey]);

  if (!formState) return null;

  return (
    <Fragment>
      {defaultFields.map(field => {
        // maybe .find may not be necessaery ..we can get the fieldState directly
        const fieldState = formState.fields.find(f => f.id === field.id);

        return (
          <FieldComponent
            key={fieldState.fieldKey}
            fieldState={fieldState}
            renderer={renderer}
          />
        );
      })}
    </Fragment>
  );
}
