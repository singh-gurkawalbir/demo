import React, { useCallback, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import { selectors } from '../../reducers';
import fields from '../DynaForm/fields';
import { withIsLoggable } from '../IsLoggableContextProvider';
import { FieldDefinitionException } from '../../utils/form';

const useStyles = makeStyles({
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: 16,
    '& > div > div:last-child': {
      marginBottom: 0,
    },
  },
  fieldStyle: {
    flexGrow: '1',
    textAlign: 'left',
    width: '100%',
    '& .Mui-disabled': {
      '-webkitTextFillColor': 'rgba(103, 122, 137, 0.8)',
    },
  },
});

const dummyFn = () => null;

const Renderer = props => {
  const { formKey, id, fieldId, type} = props;
  const classes = useStyles();
  const fid = id || fieldId;

  const fieldState = useSelector(
    state => selectors.fieldState(state, formKey, id),
    shallowEqual
  );
  const formParentContext = useSelector(
    state => selectors.formParentContext(state, formKey),
    shallowEqual
  );

  const { resourceId, resourceType } = formParentContext || {};
  const context = useMemo(() => ({ resourceId, resourceType }), [resourceId, resourceType]);

  const DynaField = fields[type] || dummyFn;
  const allFieldProps = useMemo(() => ({...props, ...fieldState, resourceContext: context}), [context, fieldState, props]);

  // get the element early on and check if its returning null
  // we had to host this earlier or else fieldState visibility is impacting it by changing the order of hooks
  let ele;

  try {
    ele = DynaField(allFieldProps);
  } catch {
    throw new FieldDefinitionException(`Invalid field definition for field: ${fid}`, fid);
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
const FieldComponent = props => {
  const { formKey, id, type} = props;

  const fieldState = useSelector(
    state => selectors.fieldState(state, formKey, id),
    shallowEqual
  );

  if (!fieldState || !fieldState.visible) return null;

  if (!fields[type]) {
    return <div>No mapped field for type: [{type}]</div>;
  }

  return (
    withIsLoggable(Renderer)(props)
  );
};

export default function FormFragment({ defaultFields = [], formKey}) {
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
