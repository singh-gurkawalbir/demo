import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/TransformIcon';
import TransformEditorDialog from '../../../../components/AFE/TransformEditor/Dialog';

function TransformationDialog({ flowId, resource, resourceType, onClose }) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'transform')
  );
  const transformLookup =
    resourceType === 'exports' ? 'transform' : 'responseTransform';
  const rules =
    resource && resource[transformLookup] && resource[transformLookup].rules;
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;
      const path = `/${transformLookup}`;
      const value = {
        rules: [rule],
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
        actions.flowData.fetchSampleData(
          flowId,
          resourceId,
          resourceType,
          'transform'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  return (
    <TransformEditorDialog
      title="Transform Mapping"
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
  name: 'importTransformation',
  left: 50,
  top: 68,
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: Transformation,
};
