import React, { useEffect, Fragment } from 'react';
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
  } = props;
  const { resourceName } = options;
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
    if (flowId && !sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'flowInput'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  const formattedSampleData = JSON.stringify(
    getFormattedSampleData({
      connection,
      sampleData,
      resourceType,
      resourceName,
    }),
    null,
    2
  );
  let formattedExtractFields = [];

  if (sampleData) {
    const extractPaths = getJSONPaths(sampleData);

    formattedExtractFields =
      (extractPaths &&
        extractPaths.map(obj => ({ name: obj.id, id: obj.id }))) ||
      [];
  }

  useEffect(() => {
    // Request for sample data only incase of flow context
    // TODO : @Raghu Do we show default data in stand alone context?
    // What type of sample data is expected in case of Page generators
    if (flowId && !sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'flowInput'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  return (
    <Fragment>
      {fieldType === 'relativeUri' && (
        <RelativeUri
          sampleData={formattedSampleData}
          connection={connection}
          extractFields={formattedExtractFields}
          {...props}
        />
      )}
      {fieldType === 'ignoreExistingData' && (
        <IgnoreExistingData
          sampleData={formattedSampleData}
          connection={connection}
          extractFields={formattedExtractFields}
          {...props}
        />
      )}
    </Fragment>
  );
}
