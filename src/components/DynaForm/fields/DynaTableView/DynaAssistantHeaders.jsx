import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import FieldMessage from '../FieldMessage';
import DynaTableView from './DynaTable';

export default function DynaAssistantHeaders(props) {
  const {
    value,
    id,
    disabled,
    formKey,
    isValid,
    description,
    errorMessages,
    onFieldChange,
  } = props;
  const dispatch = useDispatch();
  const optionsMap = useMemo(() => [
    {
      id: 'name',
      required: true,
      readOnly: true,
      type: 'input',
      supportsRefresh: false,
    },
    {
      id: 'value',
      required: true,
      readOnly: false,
      type: 'input',
      supportsRefresh: false,
    },
  ], [disabled]);

  useEffect(() => {
    if (value.find(header => ((header.name && !header.value) || (!header.name && header.value)))) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: 'All header values are required'}));
    } else {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
    }
  }, [value]);

  return (
    <>
      <DynaTableView
        {...props}
        optionsMap={optionsMap}
        onFieldChange={onFieldChange}
        disableDeleteRows
        ignoreEmptyRow
        value={value}
    />
      <FieldMessage
        isValid={isValid}
        description={description}
        errorMessages={errorMessages}
      />
    </>
  );
}
