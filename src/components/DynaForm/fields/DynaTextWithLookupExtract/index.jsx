import React, { useEffect, useMemo, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import getFormattedSampleData from '../../../../utils/sampleData';
import actions from '../../../../actions';
import getJSONPaths from '../../../../utils/jsonPaths';
import IgnoreExistingData from './IgnoreExistingData';
import RelativeUri from './RelativeUri';

export default function DynaTextWithLookupExtract(props) {
  const {
    fieldType,
    connectionId,
    options = {},
    resourceId,
    resourceType,
    flowId,
    hideLookups = false,
  } = props;
  const { resourceName } = options;
  const isExport = resourceType === 'exports';
  const isPageGenerator = useSelector(state =>
    selectors.isPageGenerator(state, flowId, resourceId, resourceType)
  );
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
    // Request for sample data only incase of flow context
    // TODO : @Raghu Do we show default data in stand alone context?
    // What type of sample data is expected in case of Page generators
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
    const extractPaths = getJSONPaths(sampleData);

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
      {fieldType === 'relativeUri' && (
        <RelativeUri
          showLookup={showLookups}
          sampleData={formattedSampleData}
          showExtractsOnly
          connection={connection}
          extractFields={formattedExtractFields}
          {...props}
        />
      )}
      {fieldType === 'ignoreExistingData' && (
        <IgnoreExistingData
          showLookup={showLookups}
          sampleData={formattedSampleData}
          connection={connection}
          extractFields={formattedExtractFields}
          {...props}
        />
      )}
    </Fragment>
  );
}
