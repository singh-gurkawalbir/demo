import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/HookIcon';
import JavaScriptEditorDrawer from '../../../../components/AFE/JavaScriptEditor/Drawer';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function PostResponseMapHookDrawer({
  flowId,
  resource,
  isViewMode,
  resourceType,
  resourceIndex,
  onClose,
}) {
  const dispatch = useDispatch();
  const hookStage = 'postResponseMap';
  const resourceId = resource._id;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const pageProcessorsObject =
    (flow && flow.pageProcessors && flow.pageProcessors[resourceIndex]) || {};
  const postResponseMapHook =
    (pageProcessorsObject.hooks &&
      pageProcessorsObject.hooks.postResponseMap) ||
    {};
  const { status: sampleDataStatus, data: sampleData } = useSelector(state =>
    selectors.getSampleDataWrapper(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'postResponseMapHook',
    })
  );

  useEffect(() => {
    if (!sampleDataStatus) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'postResponseMapHook'
        )
      );
    }
  }, [
    dispatch,
    flowId,
    resourceId,
    resourceType,
    sampleData,
    sampleDataStatus,
  ]);
  // stringified preHookData as the way Editor expects
  const preHookData = JSON.stringify(sampleData, null, 2);
  const optionalSaveParams = useMemo(
    () => ({
      pageProcessorsObject,
      processorKey: 'postResponseMapHook',
      resourceIndex,
      flowId,
    }),
    [flowId, pageProcessorsObject, resourceIndex]
  );

  return (
    <JavaScriptEditorDrawer
      title="Script editor"
      id={resourceId + flowId}
      key={resourceId + flowId}
      disabled={isViewMode}
      data={preHookData}
      insertStubKey={hookStage}
      scriptId={postResponseMapHook._scriptId}
      entryFunction={
        postResponseMapHook.function || hooksToFunctionNamesMap[hookStage]
      }
      patchOnSave
      onClose={onClose}
      optionalSaveParams={optionalSaveParams}
      isSampleDataLoading={sampleDataStatus === 'requested'}
      path="postResponseMapHook"
    />
  );
}

function PostResponseMapHook(props) {
  const { open } = props;

  return (
    <>{open && <PostResponseMapHookDrawer {...props} />}</>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'postResponseMapHook',
  position: 'right',
  Icon,
  Component: PostResponseMapHook,
};
