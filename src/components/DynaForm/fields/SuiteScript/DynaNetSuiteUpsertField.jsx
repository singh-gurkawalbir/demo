import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import DynaSelect from '../DynaSelect';


export default function DynaNetSuiteUpsertField(props) {
  const dispatch = useDispatch();
  const [flowSampleDataLoaded, setFlowSampleDataLoaded] = useState(false);


  const {ssLinkedConnectionId, resourceContext, ...rest} = props;

  const flow = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'flows',
      id: resourceContext.resourceId,
      ssLinkedConnectionId
    })
  );

  const {status: flowSampleDataStatus, data: flowSampleData} = useSelector(state => selectors.suiteScriptFlowSampleData(state, {ssLinkedConnectionId, integrationId: flow._integrationId, flowId: resourceContext.resourceId}));

  useEffect(() => {
    if (
      !flowSampleDataLoaded &&
      (flowSampleDataStatus === 'received' || flowSampleDataStatus === 'error')
    ) {
      setFlowSampleDataLoaded(true);
    }
  }, [flowSampleDataLoaded, flowSampleDataStatus]);

  const requestFlowSampleData = useCallback(
    () => {
      dispatch(
        actions.suiteScript.sampleData.request(
          {
            ssLinkedConnectionId,
            integrationId: flow._integrationId,
            flowId: resourceContext.resourceId,
          }
        )
      );
    },
    [dispatch, flow._integrationId, resourceContext.resourceId, ssLinkedConnectionId]
  );

  useEffect(() => {
    if (!flowSampleData && !flowSampleDataLoaded) {
      requestFlowSampleData();
    }
  }, [flowSampleData, flowSampleDataLoaded, requestFlowSampleData]);

  const items = [];
  flowSampleData?.forEach(field => {
    if (flow?.export?.netsuite?.restlet?.recordType) {
      items.push({value: field.id, label: field.name});
    } else {
      items.push(field);
    }
  });


  return (
    <DynaSelect {...rest} options={[{ items }]} />
  );
}
