import React, { useEffect, useMemo, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import getFormattedSampleData from '../../../../utils/sampleData';
import actions from '../../../../actions';
import getJSONPaths, { pickFirstObject } from '../../../../utils/jsonPaths';
import IgnoreExistingData from './IgnoreExistingData';
import TemplateEditor from './TemplateEditor';

// fieldType values = ['relativeUri','templateeditor','ignoreExistingData']
export default function DynaTextWithLookupExtract(props) {
  const {
    fieldType,
    connectionId,
    resourceId,
    resourceType,
    flowId,
    editorTitle,
    hideLookups = false,
    importType,
    fieldMetadata,
    fieldId,
    extractFields,
    recordType,
    options = {},
  } = props;
  const { lookups } = options;
  const isExport = resourceType === 'exports';
  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, resourceType)
  );
  const resourceObj = useSelector(state =>
    selectors.resourceData(state, resourceType, resourceId)
  );
  const { name: resourceName, adaptorType } = resourceObj.merged || {};
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', connectionId)
  );
  const dispatch = useDispatch();
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'flowInput',
    })
  );

  useEffect(() => {
    if (flowId && !sampleData && !isPageGenerator) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'flowInput'
        )
      );
    }
  }, [dispatch, flowId, isPageGenerator, resourceId, resourceType, sampleData]);

  const formattedSampleData = useMemo(
    () =>
      JSON.stringify(
        getFormattedSampleData({
          connection,
          sampleData,
          resourceType,
          resourceName,
        }),
        null,
        2
      ),
    [connection, resourceName, resourceType, sampleData]
  );
  let formattedExtractFields = [];

  if (sampleData) {
    const extractPaths = getJSONPaths(pickFirstObject(sampleData));

    formattedExtractFields =
      (extractPaths &&
        extractPaths.map(obj => ({ name: obj.id, id: obj.id }))) ||
      [];
  }

  if (isExport) {
    formattedExtractFields.push({
      name: 'lastExportDateTime',
      id: 'lastExportDateTime',
    });
  }

  const showLookups = !isExport && !hideLookups;

  return (
    <Fragment>
      {(fieldType === 'relativeUri' || fieldType === 'templateeditor') && (
        <TemplateEditor
          editorTitle={editorTitle}
          showLookup={showLookups}
          sampleData={formattedSampleData}
          showExtractsOnly
          connection={connection}
          extractFields={formattedExtractFields}
          adaptorType={adaptorType}
          resourceName={resourceName}
          lookups={lookups}
          {...props}
        />
      )}
      {fieldType === 'ignoreExistingData' && (
        <IgnoreExistingData
          showLookup={showLookups}
          sampleData={formattedSampleData}
          connection={connection}
          extractFields={formattedExtractFields}
          resourceName={resourceName}
          lookups={lookups}
          {...props}
        />
      )}
      {fieldType === 'lookupMappings' && (
        <IgnoreExistingData
          showLookup={showLookups}
          sampleData={formattedSampleData}
          connection={connection}
          extractFields={extractFields || formattedExtractFields}
          hideExtractFields
          resourceName={resourceName}
          lookups={lookups}
          importType={importType}
          fieldMetadata={fieldMetadata}
          fieldId={fieldId}
          recordType={recordType}
          {...props}
        />
      )}
    </Fragment>
  );
}
