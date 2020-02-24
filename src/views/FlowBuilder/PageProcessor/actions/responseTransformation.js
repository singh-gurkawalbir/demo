import { Fragment, useMemo } from 'react';
import Icon from '../../../../components/icons/TransformIcon';
import helpTextMap from '../../../../components/Help/helpTextMap';
import TransformToggleEditorDialog from '../../../../components/AFE/TransformEditor/TransformToggleEditorDialog';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function ResponseTransformationDialog(props) {
  const { onClose, resource, isViewMode } = props;
  const resourceId = resource._id;
  const { sampleResponseData, responseTransform } = resource;
  const { type, rule, scriptId, entryFunction } = useMemo(() => {
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
    [resourceId]
  );

  return (
    <TransformToggleEditorDialog
      title="Transform record"
      id={resourceId}
      disabled={isViewMode}
      data={sampleResponseData}
      type={type}
      scriptId={scriptId}
      rule={rule}
      entryFunction={entryFunction || hooksToFunctionNamesMap.transform}
      insertStubKey="transform"
      onClose={() => {
        onClose();
      }}
      optionalSaveParams={optionalSaveParams}
    />
  );
}

function ResponseTransformation(props) {
  const { open } = props;

  return (
    <Fragment>{open && <ResponseTransformationDialog {...props} />}</Fragment>
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
