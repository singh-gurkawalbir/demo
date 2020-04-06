import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TransformEditorDialog from '../../AFE/TransformEditor/Dialog';
import ActionButton from '../../ActionButton';
import EditIcon from '../../icons/EditIcon';
import CodeEditor from '../../CodeEditor';

const useStyles = makeStyles({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
    flexDirection: 'row',
  },
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '20vh',
    width: '50vh',
  },
  actions: {
    flexDirection: 'row !important',
    display: 'flex',
    alignItems: 'flex-start',
  },
});
const constructTransformData = (originalVal, modifiedFirstRule) => {
  const updatedRule = originalVal && originalVal.rules ? originalVal : [];

  updatedRule[0] = modifiedFirstRule;

  return {
    version: 1,
    rules: updatedRule ? [updatedRule] : [[]],
    rulesCollection: { mappings: [updatedRule] },
  };
};

export default function DynaTransformRules(props) {
  const classes = useStyles();
  const { id, resourceId, value, onFieldChange, disabled } = props;
  const firstRuleSet = value && value.rules ? value.rules[0] : null;
  const [showEditor, setShowEditor] = useState(false);
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule } = editorValues;

      onFieldChange(id, constructTransformData(value, rule));
    }

    setShowEditor(false);
  };

  const toggleEditor = () => {
    setShowEditor(!showEditor);
  };

  return (
    <div>
      {showEditor && (
        <TransformEditorDialog
          title="Transform Mapping"
          id={id + resourceId}
          data=""
          rule={firstRuleSet}
          onClose={handleClose}
          disabled={disabled}
        />
      )}
      <div className={classes.root}>
        <div className={classes.editorContainer}>
          <CodeEditor
            name={id}
            value={JSON.stringify(value && value.rules, null, 2)}
            mode="json"
            readOnly
          />
        </div>
        <div>
          <ActionButton
            disabled={disabled}
            data-test="editTransformation"
            onClick={toggleEditor}>
            <EditIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
