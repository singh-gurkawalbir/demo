import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TransformEditorDialog from '../../../components/AFE/TransformEditor/Dialog';

export default function DynaTransformEditor(props) {
  const { id, rules, label, sampleData, resourceId, onFieldChange } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, { rule });
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
          data={sampleData}
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
