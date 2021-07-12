import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import DynaSelect from './DynaSelect';
import { selectors } from '../../../reducers/index';

const emptyArray = [];

export default function DynaDynamicSelect(props) {
  const {formKey, dependentFieldId, optionsMap, onFieldChange, id} = props;
  const dependentValue = useSelector(state => selectors.fieldState(state, formKey, dependentFieldId)?.value);
  const [prevValue, setPrevValue] = useState(dependentValue);
  const options = useMemo(() => [{items: optionsMap[dependentValue] || emptyArray}], [optionsMap, dependentValue]);

  // reset the select field on dependent field value change
  useEffect(() => {
    if (prevValue !== dependentValue) {
      onFieldChange(id, '', true);
      setPrevValue(dependentValue);
    }
  }, [prevValue, dependentValue, onFieldChange, id]);

  return <DynaSelect {...props} options={options} />;
}
