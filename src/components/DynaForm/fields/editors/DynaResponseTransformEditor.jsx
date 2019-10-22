import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TransformEditorDialog from '../../../AFE/TransformEditor/Dialog';

export default function DynaResponseTransformEditor(props) {
  const { id, label, resourceId, onFieldChange, value, options = {} } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  /*
   * Creates transform rules as per required format to be saved
   */
  const constructTransformData = rule => ({
    version: 1,
    rules: rule ? [rule] : [[]],
    rulesCollection: { mappings: [rule] },
  });
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, constructTransformData(rule));
    }

    setShowEditor(false);
  };

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
          data={
            options.sampleResponseData &&
            JSON.parse(JSON.stringify(options.sampleResponseData))
          }
          rule={firstRuleSet}
          onClose={handleClose}
        />
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleEditorClick}
        data-test={id}>
        {label}
      </Button>
    </Fragment>
  );
}
