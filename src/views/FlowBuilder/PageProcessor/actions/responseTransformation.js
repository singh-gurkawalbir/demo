import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';
import helpTextMap from '../../../../components/Help/helpTextMap';
import TransformToggleEditorDialog from '../../../../components/AFE/TransformEditor/TransformToggleEditorDialog';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function ResponseTransformationDialog(props) {
  const { onClose, resource, isViewMode, flowId } = props;
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const { responseTransform } = resource;
  const { status, data: sampleResponseData } = useSelector((state) => selectors.getSampleDataWrapper(state, {
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
    <TransformToggleEditorDialog
      title="Transform response"
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
    />
  );
}

function ResponseTransformation(props) {
  const { open } = props;

  return (
    <>{open && <ResponseTransformationDialog {...props} />}</>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'responseTransformation',
  position: 'middle',
  Icon,
  helpText: helpTextMap['fb.pp.imports.transform'],
  Component: ResponseTransformation,
};
