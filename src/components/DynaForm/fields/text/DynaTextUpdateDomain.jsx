
import React, {useEffect} from 'react';
import DynaText from '../DynaText';
import useFormContext from '../../../Form/FormContext';

export default function DynaTextUpdateDomain(props) {
  const {onFieldChange, formKey, id } = props;
  const fieldStates = useFormContext(formKey)?.fields;
  const {value, touched} = fieldStates.enviornment || {};

  useEffect(() => {
    if (!touched) return;
    let finalValue;

    if (value === 'sandbox') {
      finalValue = 'api.demo';
    }
    if (value === 'production') {
      finalValue = 'api';
    }
    onFieldChange(id, finalValue);
  }, [id, onFieldChange, touched, value]);

  return <DynaText {...props} />;
}
