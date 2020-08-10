import React, { useCallback } from 'react';
import { deepClone } from 'fast-json-patch';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TransformEditorDrawer from '../../AFE/TransformEditor/Drawer';
import ActionButton from '../../ActionButton';
import EditIcon from '../../icons/EditIcon';
import CodeEditor from '../../CodeEditor';
import usePushRightDrawer from '../../../hooks/usePushRightDrawer';

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
  const pushRightDrawer = usePushRightDrawer(id);
  const rule = getTransformRule(value);
  const handleSave = useCallback((shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { rule: newRule } = editorValues;

      onFieldChange(id, constructTransformData(rule || [], newRule));
    }
  }, [id, onFieldChange, rule]);

  return (
    <div>
      <TransformEditorDrawer
        title="Transform Mapping"
        id={id + resourceId}
        data=""
        rule={rule && rule[0]}
        onSave={handleSave}
        disabled={disabled}
        path={id}
        />

      <Typography className={classes.label}>{label}</Typography>
      <div className={classes.root}>
        <div className={classes.editorContainer}>
          <CodeEditor name={id} value={rule} mode="json" readOnly />
        </div>
        <div>
          <ActionButton
            disabled={disabled}
            data-test="editTransformation"
            onClick={pushRightDrawer}>
            <EditIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
