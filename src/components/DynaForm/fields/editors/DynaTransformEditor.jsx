import { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import TransformEditorDialog from '../../../AFE/TransformEditor/Dialog';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';

export default function DynaTransformEditor(props) {
  const {
    id,
    label,
    sampleData,
    resourceId,
    resourceType,
    onFieldChange,
    value,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const dispatch = useDispatch();
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  /*
   * Creates transform rules as per required format to be saved
   */
  const constructTransformData = rule => ({
    version: 1,
    rules: [rule],
    rulesCollection: { mappings: [rule] },
  });
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, constructTransformData(rule));
      // Dispatch an action to save processor data
      dispatch(
        actions.sampleData.request(
          resourceId,
          resourceType,
          editorValues,
          'transform'
        )
      );
    }

    setShowEditor(false);
  };

  // Gets data to be Transformed
  const { data: preTransformData } = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'transform')
  );
  // when we launch the editor we are only going to entertain the first
  // rule set
  const firstRuleSet = value && value.rules ? value.rules[0] : null;

  // We are deliberately concat the id and resourceId, in order to create
  // a more unique key for the transform editor launch per resource. This will
  // cause react to shake the component tree to perform a rerender and the
  // rule elements key would use just the row index.
  return (
    <Fragment>
      {showEditor && (
        <TransformEditorDialog
          title="Transform Mapping"
          id={id + resourceId}
          data={preTransformData || sampleData}
          rule={firstRuleSet}
          onClose={handleClose}
        />
      )}
      <Button variant="contained" color="primary" onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
