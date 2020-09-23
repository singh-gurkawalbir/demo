import React, { useCallback } from 'react';
import { makeStyles} from '@material-ui/core';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import { selectors } from '../../reducers';
import fields from '../DynaForm/fields';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  fieldStyle: {
    flexGrow: '1',
    textAlign: 'left',
    width: '100%',
  },
});

const dummyFn = () => null;
export const FieldComponent = props => {
  const { formKey, id, fieldId, type} = props;
  const classes = useStyles();
  const fieldState = useSelector(
    state => selectors.fieldState(state, formKey, id),
    shallowEqual
  );
  const formParentContext = useSelector(
    state => selectors.formParentContext(state, formKey),
    shallowEqual
  );
  const fid = id || fieldId;

  const { resourceId, resourceType } = formParentContext || {};
  const context = { resourceId, resourceType };
  const DynaField = fields[type] || dummyFn;
  // get the element early on and check if its returning null
  // we had to host this earlier or else fieldState visibility is impacting it by changing the order of hooks
  const ele = DynaField({...props, ...fieldState, resourceContext: context});

  if (!fieldState || !fieldState.visible) return null;

  if (!fields[type]) {
    return <div>No mapped field for type: [{type}]</div>;
  }

  return (
  // if its returning null wrap it within divs else return null
    ele ? (
      <div key={fid} className={classes.wrapper}>
        <div id={id} className={classes.fieldStyle} >
          {ele}
        </div>
      </div>
    ) : null
  );
};

export default function FormFragment({ defaultFields, formKey }) {
  const dispatch = useDispatch();

  const onFieldChange = useCallback(
    (fieldId, value, skipFieldTouched) =>
      dispatch(
        actions.form.fieldChange(formKey)(fieldId, value, skipFieldTouched)
      ),
    [dispatch, formKey]
  );
  const onFieldBlur = useCallback(
    fieldId => dispatch(actions.form.fieldBlur(formKey)(fieldId)),
    [dispatch, formKey]
  );
  const onFieldFocus = useCallback(
    fieldId => dispatch(actions.form.fieldFocus(formKey)(fieldId)),
    [dispatch, formKey]
  );
  const registerField = useCallback(
    field => dispatch(actions.form.registerField(formKey)(field)),
    [dispatch, formKey]
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
    <>
      {defaultFields.map(field => (
        <FieldComponent
          {...field}
          key={field.id}
          id={field.id}
          onFieldChange={onFieldChange}
          onFieldBlur={onFieldBlur}
          onFieldFocus={onFieldFocus}
          formKey={formKey}
          registerField={registerField}
        />
      ))}
    </>
  );
}
