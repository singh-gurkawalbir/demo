import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';
import TransformToggleEditorDrawer from '../../../../components/AFE/TransformEditor/TransformToggleEditorDrawer';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function ResponseTransformationDrawer(props) {
  const { onClose, resource, isViewMode, flowId } = props;
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const { responseTransform } = resource;
  const { status, data: sampleResponseData } = useSelector(state => selectors.sampleDataWrapper(state, {
    flowId,
    resourceId,
    resourceType: 'imports',
    stage: 'sampleResponse',
  }));
  const {
    type, rule, scriptId, entryFunction,
  } = useMemo(() => {
    const { type, script = {}, expression = {} } = responseTransform || {};

    return {
      type,
      rule: expression.rules && expression.rules[0],
      scriptId: script._scriptId,
      entryFunction: script.function,
    };
  }, [responseTransform]);
  const optionalSaveParams = useMemo(
    () => ({
      processorKey: 'responseTransform',
      resourceId,
      resourceType: 'imports',
    }),
    [resourceId],
  );

  useEffect(() => {
    if (!status) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          'imports',
          'sampleResponse',
        ),
      );
    }
  }, [dispatch, flowId, resourceId, status]);

  return (
    <TransformToggleEditorDrawer
      title="Define transformation"
      helpTitle="Transform rules"
      helpKey="export.transform.rules"
      id={resourceId}
      disabled={isViewMode}
      data={sampleResponseData}
      type={type}
      scriptId={scriptId}
      rule={rule}
      entryFunction={entryFunction || hooksToFunctionNamesMap.transform}
      insertStubKey="transform"
      onClose={onClose}
      optionalSaveParams={optionalSaveParams}
      isSampleDataLoading={status === 'requested'}
      path="responseTransformation"
    />
  );
}

function ResponseTransformation(props) {
  const { open } = props;

  return (
    <>{open && <ResponseTransformationDrawer {...props} />}</>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'responseTransformation',
  position: 'middle',
  Icon,
  helpKey: 'fb.pp.imports.transform',
  Component: ResponseTransformation,
};
