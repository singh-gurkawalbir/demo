/* eslint-disable camelcase */
import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import DynaURI from './DynaURI_afe';

const emptyObj = {};

export default function DynaRelativeUri_afe(props) {
  const {value, arrayIndex, ...rest} = props;
  const {
    connectionId,
    formKey,
    id,
    pagingMethodsToValidate,
    pagingFieldsToValidate,
    deltaFieldsToValidate,
    validateInComponent,
  } = rest;

  const dispatch = useDispatch();
  const connection = useSelector(state => selectors.resource(state, 'connections', connectionId));

  const { type } = connection || emptyObj;
  const description = type === 'http' || type === 'rest' ? `Relative to: ${connection[type].baseURI}` : '';
  const inputValue = typeof arrayIndex === 'number' && Array.isArray(value) ? value[arrayIndex] : value;

  const pagingMsg = useSelector(state => selectors.httpPagingValidationError(state, formKey, pagingMethodsToValidate, pagingFieldsToValidate));
  const deltaMsg = useSelector(state => selectors.httpDeltaValidationError(state, formKey, deltaFieldsToValidate));

  useEffect(() => {
    if (!validateInComponent) return;
    const errorMessages = deltaMsg || pagingMsg;

    // if there are validations error, show the error message
    if (errorMessages) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages}));
    } else {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
    }
  }, [validateInComponent, deltaMsg, dispatch, formKey, id, pagingMsg]);

  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

  return (
    <DynaURI
      {...rest}
      value={inputValue}
      description={description}
    />
  );
}
