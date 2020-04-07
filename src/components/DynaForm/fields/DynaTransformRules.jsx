import { useState } from 'react';
import { deepClone } from 'fast-json-patch';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TransformEditorDialog from '../../AFE/TransformEditor/Dialog';
import ActionButton from '../../ActionButton';
import EditIcon from '../../icons/EditIcon';
import CodeEditor from '../../CodeEditor';

const useStyles = makeStyles({
  label: {
    fontSize: 15,
    padding: 0,
  },
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
const constructTransformData = (rule, modifiedFirstRule) => {
  const _rule = deepClone(rule);

  _rule[0] = modifiedFirstRule;

  return {
    version: 1,
    rules: _rule,
    rulesCollection: { mappings: _rule },
  };
};

const getTransformRule = value => {
  if (!value || !value.rules) {
    return undefined;
  }

  return value.rules;
};

// TODO (Azhar) Work on styling
export default function DynaTransformRules(props) {
  const classes = useStyles();
  const { id, resourceId, value, label, onFieldChange, disabled } = props;
  const rule = getTransformRule(value);
  const [showEditor, setShowEditor] = useState(false);
  const handleClose = (shouldCommit, editorValues) => {
    setShowEditor(false);

    if (shouldCommit) {
      const { rule: newRule } = editorValues;

      onFieldChange(id, constructTransformData(rule || [], newRule));
    }
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
          rule={rule && rule[0]}
          onClose={handleClose}
          disabled={disabled}
        />
      )}
      <Typography className={classes.label}>{label}</Typography>
      <div className={classes.root}>
        <div className={classes.editorContainer}>
          <CodeEditor name={id} value={rule} mode="json" readOnly />
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
