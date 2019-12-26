import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/HookIcon';
import JavaScriptEditorDialog from '../../../../components/AFE/JavaScriptEditor/Dialog';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';

function PostResponseMapHookDialog({
  flowId,
  resource,
  isViewMode,
  resourceType,
  resourceIndex,
  onClose,
}) {
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const hookStage = 'postResponseMap';
  const resourceId = resource._id;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const pageProcessorsObject =
    (flow && flow.pageProcessors && flow.pageProcessors[resourceIndex]) || {};
  const postResponseMapHook =
    (pageProcessorsObject.hooks &&
      pageProcessorsObject.hooks.postResponseMap) ||
    {};
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType,
      stage: hookStage,
    })
  );
  const saveScript = values => {
    const { code, scriptId } = values;
    const patchSet = [
      {
        op: 'replace',
        path: '/content',
        value: code,
      },
    ];

    dispatch(actions.resource.patchStaged(scriptId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('scripts', scriptId, 'value'));
  };

  const savePostResponseMapHook = values => {
    const patchSet = [];
    const { scriptId: _scriptId, entryFunction } = values;

    if (!pageProcessorsObject.hooks) {
      patchSet.push({
        op: 'add',
        path: `/pageProcessors/${resourceIndex}/hooks`,
        value: {},
      });
    }

    patchSet.push({
      op:
        pageProcessorsObject.hooks && pageProcessorsObject.hooks.postResponseMap
          ? 'replace'
          : 'add',
      path: `/pageProcessors/${resourceIndex}/hooks/postResponseMap`,
      value: { _scriptId, function: entryFunction },
    });
    dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('flows', flowId, 'value'));
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      if (!editorValues || !editorValues.scriptId) {
        // Should not save hooks without script Id
        // TODO: @Aditya Need to move this logic into JS Editor , disabling save if there is no script selected
        return enqueueSnackbar({
          message: 'Please select Script ID',
          variant: 'error',
        });
      }

      // Saves the script first with updated content against scriptId
      saveScript(editorValues);
      // Saves postResponseMap Hook on pageProcessor based on resourceIndex
      savePostResponseMapHook(editorValues);
    }

    onClose();
  };

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          hookStage
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);
  // If there is sampleData wraps inside data { errors: [], data: [sampleData] } , else shows default {}
  // And stringified as the way Editor expects
  const preHookData = JSON.stringify(
    sampleData ? { errors: [], data: [sampleData] } : {},
    null,
    2
  );

  return (
    <JavaScriptEditorDialog
      title="Script Editor"
      id={resourceId + flowId}
      key={resourceId + flowId}
      disabled={isViewMode}
      data={preHookData}
      insertStubKey={hookStage}
      scriptId={postResponseMapHook._scriptId}
      entryFunction={
        postResponseMapHook.function || hooksToFunctionNamesMap[hookStage]
      }
      onClose={handleClose}
    />
  );
}

function PostResponseMapHook(props) {
  const { open } = props;

  return (
    <Fragment>{open && <PostResponseMapHookDialog {...props} />}</Fragment>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'postResponseMapHook',
  position: 'right',
  Icon,
  Component: PostResponseMapHook,
};
