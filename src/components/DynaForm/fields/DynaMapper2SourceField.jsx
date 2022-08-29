import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { FormLabel, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Mapper2ExtractsTypeableSelect from '../../AFE/Editor/panels/Mappings/Mapper2/Source/Mapper2ExtractsTypeableSelect';
import {selectors} from '../../../reducers';
import { getMappingsEditorId } from '../../../utils/editor';
import { MAPPING_DATA_TYPES } from '../../../utils/mapping';
import useFormContext from '../../Form/FormContext';
import { useSelectorMemo } from '../../../hooks';
import { isFileAdaptor, isAS2Resource } from '../../../utils/resource';

const useStyles = makeStyles({
  fieldWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  dynaWrapper: {
    width: '100%',
  },
});

export default function DynaMapper2SourceField(props) {
  const {
    id,
    label,
    onFieldChange,
    nodeKey,
    disabled,
    value,
    resourceId,
    formKey,
  } = props;
  const classes = useStyles();
  const {fields} = useFormContext(formKey);
  const importResource = useSelectorMemo(selectors.makeResourceSelector, 'imports', resourceId);

  const dataType = fields.dataType?.value;
  const copySource = fields.copySource?.value || 'no';
  const noSourceField = fields.fieldMappingType?.value === 'hardCoded' || fields.fieldMappingType?.value === 'multifield';
  const isDynamicLookup = fields.fieldMappingType?.value === 'lookup' && fields['lookup.mode']?.value !== 'static';
  const isFileAdaptorLookup = fields.fieldMappingType?.value === 'lookup' && (isFileAdaptor(importResource) || isAS2Resource(importResource));

  const editorLayout = useSelector(state => selectors.editorLayout(state, getMappingsEditorId(resourceId)));
  const handleExtractBlur = useCallback(value => {
    onFieldChange(id, value);
  }, [id, onFieldChange]);

  const hideSourceField = (dataType === MAPPING_DATA_TYPES.OBJECT && copySource === 'no') ||
  (isDynamicLookup && !isFileAdaptorLookup) || noSourceField;

  if (hideSourceField) return null;

  return (
    <>
      <div className={classes.fieldWrapper}>
        <FormLabel htmlFor={id}>
          {label}
        </FormLabel>
        {/* <FieldHelp {...props} /> */}
      </div>
      <FormControl
        key={id}
        disabled={disabled}
        className={classes.dynaWrapper}
       >
        <Mapper2ExtractsTypeableSelect
          key={value}
          id={`fieldMappingExtract-${nodeKey}`}
          nodeKey={nodeKey}
          value={value}
          disabled={disabled}
          dataType={dataType}
          onBlur={handleExtractBlur}
          editorLayout={editorLayout}
            />
      </FormControl>
    </>
  );
}
