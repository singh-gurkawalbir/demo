import { useEffect, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';
import TransformEditorDialog from '../../../../components/AFE/TransformEditor/Dialog';

function TransformationDialog({ flowId, resource, onClose }) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'transform', true)
  );
  const rules = useMemo(
    () => resource && resource.transform && resource.transform.rules,
    [resource]
  );
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;
      const path = '/transform';
      const value = {
        rules: [rule],
        version: '1',
      };
      const patchSet = [{ op: 'replace', path, value }];

      // Save the resource
      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('exports', resourceId, 'value'));
    }

    onClose();
  };

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.fetchSampleData(
          flowId,
          resourceId,
          'exports',
          'transform',
          true
        )
      );
    }
  }, [dispatch, flowId, resourceId, sampleData]);

  return (
    <TransformEditorDialog
      title="Transform Mapping"
      id={resourceId}
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
  name: 'exportTransformation',
  position: 'right',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: Transformation,
};
