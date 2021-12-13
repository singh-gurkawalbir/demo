import React, {useEffect} from 'react';
import DynaText from '../DynaText';
import useFormContext from '../../../Form/FormContext';

export default function DynaTextUpdateDomain(props) {
  const {onFieldChange, formKey, id } = props;
  const fieldStates = useFormContext(formKey)?.fields;
  const {value, touched} = fieldStates.environment || {};

  useEffect(() => {
    if (!touched) return;

    onFieldChange(id, value === 'sandbox' ? 'api.demo' : 'api');
  }, [id, onFieldChange, touched, value]);

  return <DynaText {...props} />;
}
