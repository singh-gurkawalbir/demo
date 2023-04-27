/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deepClone } from 'fast-json-patch';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ActionButton from '../../ActionButton';
import EditIcon from '../../icons/EditIcon';
import CodeEditor from '../../CodeEditor2';
import { getValidRelativePath } from '../../../utils/routePaths';
import actions from '../../../actions';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import { EXPORT_FILTERED_DATA_STAGE, IMPORT_FILTERED_DATA_STAGE } from '../../../utils/flowData';

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
    width: '100%',
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
export default function DynaTransformRules_afe({
  id,
  resourceId,
  resourceType,
  flowId,
  formKey,
  value,
  label,
  onFieldChange,
  disabled }) {
  const classes = useStyles();
  const rule = getTransformRule(value);
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

  const handleSave = useCallback(editorValues => {
    const { rule: newRule } = editorValues;

    onFieldChange(id, constructTransformData(rule || [], newRule));
  }, [id, onFieldChange, rule]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions.editor.init(editorId, 'transform', {
      data: {},
      rule: rule?.[0],
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: resourceType === 'exports' ? EXPORT_FILTERED_DATA_STAGE : IMPORT_FILTERED_DATA_STAGE,
      onSave: handleSave,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, editorId, flowId, formKey, handleSave, history, id, match.url, resourceId, resourceType, rule]);

  return (
    <div>
      <Typography className={classes.label}>{label}</Typography>
      <div className={classes.root}>
        <div className={classes.editorContainer}>
          <CodeEditor name={id} value={rule} mode="json" readOnly />
        </div>
        <div>
          <ActionButton
            disabled={disabled}
            data-test="editTransformation"
            onClick={handleEditorClick}>
            <EditIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
