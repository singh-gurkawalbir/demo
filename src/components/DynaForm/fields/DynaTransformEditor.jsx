import { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import TransformEditorDialog from '../../../components/AFE/TransformEditor/Dialog';
import * as selectors from '../../../reducers';
import actions from '../../../actions';

export default function DynaTransformEditor(props) {
  const { id, rules, label, sampleData, resourceId, onFieldChange } = props;
  const [showEditor, setShowEditor] = useState(false);
  const dispatch = useDispatch();
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  // Get raw data from state
  const rawData = useSelector(state => {
    const exportData = selectors.getSampleData(state, resourceId, 'transform');

    return exportData && exportData[0];
  });
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, { rule });

      dispatch(
        actions.exportData.update(resourceId, 'exports', {
          processor: 'transform',
          rules: [rule],
          data: rawData || sampleData,
        })
      );
    }

    setShowEditor(false);
  };

  // when we launch the editor we are only going to entertain the first
  // rule set
  const firstRuleSet = rules ? rules[0] : null;

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
          data={rawData || sampleData}
          rule={firstRuleSet}
          onClose={handleClose}
        />
      )}
      <Button
        variant="contained"
        // color="secondary"
        onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
