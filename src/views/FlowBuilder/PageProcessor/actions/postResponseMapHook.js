import { useCallback, useMemo, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
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
      stage: 'postResponseMapHook',
    })
  );
  const handleClose = useCallback(
    (shouldCommit, editorValues) => {
      // script gets saved automatically on click of save
      // TODO: work on this Aditya
      if (shouldCommit) {
        if (!editorValues || !editorValues.scriptId) {
          // Should not save hooks without script Id
          // TODO: @Aditya Need to move this logic into JS Editor , disabling save if there is no script selected
          return enqueueSnackbar({
            message: 'Please select Script ID',
            variant: 'error',
          });
        }
      }

      onClose();
    },
    [enqueueSnackbar, onClose]
  );

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'postResponseMapHook'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);
  // stringified preHookData as the way Editor expects
  const preHookData = JSON.stringify(
    {
      postResponseMapData: isEmpty(sampleData) ? {} : sampleData,
    },
    null,
    2
  );
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
      patchOnSave
      onClose={handleClose}
      optionalSaveParams={optionalSaveParams}
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
