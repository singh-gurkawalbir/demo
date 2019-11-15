import { useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';
import TransformEditorDialog from '../../../../components/AFE/TransformEditor/Dialog';
import helpTextMap from '../../../../components/Help/helpTextMap';

function TransformationDialog({
  flowId,
  resource,
  integrationId,
  resourceType,
  onClose,
}) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'transform')
  );
  const transformLookup =
    resourceType === 'exports' ? 'transform' : 'responseTransform';
  const rules = useMemo(
    () =>
      resource && resource[transformLookup] && resource[transformLookup].rules,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;
      const path = `/${transformLookup}`;
      const value = {
        rules: rule ? [rule] : [[]],
        version: '1',
      };
      const patchSet = [{ op: 'replace', path, value }];

      // Save the resource
      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resourceId, 'value')
      );
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
          'transform'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  const isViewMode = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );

  return (
    <TransformEditorDialog
      title="Transform Mapping"
      disabled={isViewMode}
      id={resourceId + flowId}
      data={sampleData}
      rule={rules && rules[0]}
      onClose={handleClose}
    />
  );
}

function Transformation(props) {
  const { open } = props;

  return <Fragment>{open && <TransformationDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'lookupTransformation',
  position: 'middle',
  Icon,
  helpText: helpTextMap['fb.pp.exports.transform'],
  Component: Transformation,
};
