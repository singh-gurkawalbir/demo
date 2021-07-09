import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DynaSelect from './DynaSelect';
import { selectors } from '../../../reducers/index';

export default function DynaDynamicSelect(props) {
  const {formKey, dependentFieldId, optionsMap, onFieldChange, id} = props;

  const dependentValue = useSelector(state => selectors.fieldState(state, formKey, dependentFieldId))?.value;

  const options = optionsMap[dependentValue] || [];

  const [prevValue, setPrevValue] = useState(dependentValue);

  useEffect(() => {
    if (prevValue !== dependentValue) {
      onFieldChange(id, '', true);
      setPrevValue(dependentValue);
    }
  }, [prevValue, dependentValue, onFieldChange, id]);

  return <DynaSelect {...props} options={[{ items: options}]} />;
}
