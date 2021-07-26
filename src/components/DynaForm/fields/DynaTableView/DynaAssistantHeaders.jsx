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
    headersMetadata = [],
    description,
    errorMessages,
    onFieldChange,
  } = props;
  const dispatch = useDispatch();
  const isRequired = headerName => headersMetadata.find(header => header.name === headerName)?.required !== false;
  const getRequiredMessage = value => {
    const missingRequiredHeaders = value.filter(header => !header.value && isRequired(header.name)).map(header => header.name);

    return `${missingRequiredHeaders.join(', ')} headers are required`;
  };
  const optionsMap = useMemo(() => [
    {
      id: 'name',
      required: false,
      readOnly: true,
      type: 'input',
      supportsRefresh: false,
    },
    {
      id: 'value',
      required: false,
      readOnly: false,
      type: 'input',
      supportsRefresh: false,
    },
  ], [disabled]);

  useEffect(() => {
    if (value.find(header => (header.name && isRequired(header.name) && !header.value))) {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: false, errorMessages: getRequiredMessage(value)}));
    } else {
      dispatch(actions.form.forceFieldState(formKey)(id, {isValid: true}));
    }
  }, [value]);

  useEffect(() => () => {
    dispatch(actions.form.clearForceFieldState(formKey)(id));
  }, [dispatch, formKey, id]);

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
