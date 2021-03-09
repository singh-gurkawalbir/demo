import React, { useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { cloneDeep, isEqual } from 'lodash';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import SqlQueryBuilderEditorDrawer from '../../../AFE/SqlQueryBuilderEditor/Drawer';
import { getDefaultData } from '../../../../utils/sampleData';
import { getUnionObject } from '../../../../utils/jsonPaths';
import { getUniqueFieldId } from '../../../../utils/editor';
import DynaLookupEditor from '../DynaLookupEditor';

export default function SQLQueryBuilderWrapper(props) {
  const {
    id,
    fieldId,
    onFieldChange,
    disabled,
    value,
    querySetPos,
    resourceId,
    flowId,
    resourceType,
    hideDefaultData,
    lookups,
    modelMetadata,
    optionalSaveParams,
    patchOnSave,
    label,
    disableEditorV2,
    enableEditorV2,
  } = props;
  const fieldType = getUniqueFieldId(id || fieldId);
  const dispatch = useDispatch();
  const parsedRule = useMemo(() => typeof querySetPos !== 'undefined' && Array.isArray(value)
    ? value[querySetPos]
    : value,
  [querySetPos, value]);

  const adaptorType = useSelector(state => {
    const { merged: resourceData} = selectors.resourceData(state, 'imports', resourceId);

    return resourceData?.adaptorType;
  });

  const isEditorV2Supported = useSelector(state => {
    if (disableEditorV2) {
      return false;
    }

    return selectors.isEditorV2Supported(state, resourceId, resourceType, flowId, enableEditorV2);
  });
  const sampleData = useSelector(state => selectors.editorSampleData(state, { flowId, resourceId, fieldType }), isEqual);

  const formattedSampleData = useSelector(state => selectors.sampleDataWrapper(state, {
    sampleData,
    flowId,
    resourceId,
    resourceType,
    fieldType,
    stage: 'flowInput',
  })?.data, shallowEqual);

  const loadEditorSampleData = useCallback(
    (version, stage) => {
      dispatch(
        actions.editorSampleData.request({
          flowId,
          resourceId,
          resourceType,
          stage: stage || 'flowInput',
          formKey: props.formKey,
          fieldType,
          isEditorV2Supported,
          requestedTemplateVersion: version,
        })
      );
    },
    [dispatch, flowId, resourceId, props.formKey, resourceType, fieldType, isEditorV2Supported]
  );
  const handleEditorVersionToggle = useCallback(
    version => {
      loadEditorSampleData(version);
    },
    [loadEditorSampleData]
  );

  useEffect(() => {
    if (flowId) {
      loadEditorSampleData();
    }
  }, [flowId, loadEditorSampleData]);

  const formattedDefaultData = useMemo(() => {
    if (modelMetadata) {
      return sampleData.templateVersion === 2 ? {record: {...modelMetadata}} : {data: {...modelMetadata}};
    }
    let defaultData = {};
    const {data} = sampleData;

    if (Array.isArray(data) && data.length && typeof data[0] === 'object') {
      defaultData = cloneDeep(getUnionObject(data));
    } else if (data) {
      defaultData = cloneDeep(data);
    }

    return getDefaultData(defaultData);
  }, [modelMetadata, sampleData]);

  const handleSave = useCallback((shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template, defaultData } = editorValues;

      if (adaptorType === 'RDBMSImport') {
        let parsedDefaultData;

        try {
          parsedDefaultData = JSON.parse(defaultData);

          if (parsedDefaultData.data) {
            onFieldChange('modelMetadata', parsedDefaultData.data);
          } else if (parsedDefaultData.record) {
            onFieldChange('modelMetadata', parsedDefaultData.record);
          }
        } catch (e) { // do nothing }
        }
      }
      if (typeof querySetPos !== 'undefined' && Array.isArray(value)) {
        // save to array at position querySetPos
        const valueTmp = value;

        valueTmp[querySetPos] = template;
        onFieldChange(id, valueTmp);
      } else {
        // save to field
        onFieldChange(id, template);
      }
    }
  }, [adaptorType, querySetPos, id, onFieldChange, value]);

  const lookupField = useMemo(() => {
    if (adaptorType === 'RDBMSImport') {
      return (
        <DynaLookupEditor
          id="rdbms.lookups"
          label="Manage lookups"
          value={lookups}
          onFieldChange={onFieldChange}
          flowId={flowId}
          resourceType={resourceType}
          resourceId={resourceId}
/>
      );
    }
  }, [adaptorType, flowId, lookups, onFieldChange, resourceId, resourceType]);

  return (
    <>
      <SqlQueryBuilderEditorDrawer
        title={label}
        id={`${resourceId}-${id}`}
        rule={parsedRule}
        lookups={lookups}
        sampleData={JSON.stringify(formattedSampleData, null, 2)}
        defaultData={JSON.stringify(formattedDefaultData, null, 2)}
        onFieldChange={onFieldChange}
        onSave={handleSave}
        action={lookupField}
        disabled={disabled}
        showDefaultData={!hideDefaultData}
        path={id}
        isSampleDataLoading={sampleData.status === 'requested'}
        optionalSaveParams={optionalSaveParams}
        patchOnSave={patchOnSave}
        showVersionToggle={isEditorV2Supported}
        editorVersion={sampleData.templateVersion}
        onVersionToggle={handleEditorVersionToggle}
        />
    </>
  );
}
