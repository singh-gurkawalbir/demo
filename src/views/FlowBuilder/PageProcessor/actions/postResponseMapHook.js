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
      stage: 'responseMappingExtract',
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
          'responseMappingExtract'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  return (
    <JavaScriptEditorDialog
      title="Script Editor"
      id={resourceId + flowId}
      key={resourceId + flowId}
      disabled={isViewMode}
      data={
        sampleData &&
        JSON.stringify({ errors: [], data: [sampleData] }, null, 2)
      }
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
