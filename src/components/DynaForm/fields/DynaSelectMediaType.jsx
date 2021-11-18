import React from 'react';
import DynaSelect from './DynaSelect';
import { selectors } from '../../../reducers';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

export default function DynaSelectMediaType(props) {
  const { id, formKey, options, dependentFieldForMediaType, resourceType } = props;

  const {modifiedOptions, parentFieldMediaType} = useSelectorMemo(selectors.mkGetMediaTypeOptions, {
    formKey,
    fieldId: id,
    resourceType,
    dependentFieldForMediaType,
    options,
  });

  return (
    <DynaSelect
      {...props}
      options={modifiedOptions}
      value={(props.value === parentFieldMediaType) ? '' : props.value}
   />
  );
}
