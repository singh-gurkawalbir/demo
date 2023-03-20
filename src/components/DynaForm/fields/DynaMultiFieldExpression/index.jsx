import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import DynaText from '../DynaText';
import { selectors } from '../../../../reducers';
import { formattedMultiFieldExpression } from '../../../../utils/mapping';

export default function DynaMultiFieldExpression(props) {
  const { formKey, value, onFieldChange, id } = props;
  const { functionValue, extractValue } = useSelector(state => {
    const formContext = selectors.formState(state, formKey) || {};

    return {
      functionValue: formContext?.value?.functions,
      extractValue: formContext?.value?.extract,
    };
  }, shallowEqual);

  useEffect(() => {
    const updatedExpression = formattedMultiFieldExpression(value, functionValue, extractValue);

    onFieldChange(id, updatedExpression, true);
    // reset these fields when expression is updated
    if (functionValue) onFieldChange('functions', '', true);
    if (extractValue) onFieldChange('extract', '', true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [functionValue, extractValue]);

  return <DynaText {...props} />;
}
