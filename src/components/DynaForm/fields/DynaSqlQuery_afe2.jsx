/* eslint-disable camelcase */
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import {makeStyles, FormLabel, FormHelperText} from '@material-ui/core';
import clsx from 'clsx';
import CodeEditor from '../../CodeEditor';
import actions from '../../../actions';
import ActionButton from '../../ActionButton';
import ExitIcon from '../../icons/ExitIcon';
import FieldHelp from '../FieldHelp';
import { getValidRelativePath } from '../../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  container: {
    overflowY: 'off',
  },
  label: {
    fontSize: '12px',
    marginTop: theme.spacing(1),
  },
  editorButton: {
    float: 'right',
  },
  inlineEditorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    height: theme.spacing(10),
  },
  dynaSqlQueryWrapper: {
    display: 'flex',
  },
  editorContainer: {
    border: '1px solid rgb(0,0,0,0.1)',
    height: '50vh',
    width: '65vh',
  },
}));

export default function DynaSqlQuery_afe2(props) {
  const {
    id,
    resourceId,
    flowId,
    resourceType,
    onFieldChange,
    value,
    label,
    editorClassName,
    disabled,
    isValid,
    errorMessages,
    formKey,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

  const handleSave = useCallback(editorVal => { onFieldChange(id, editorVal.rule); }, [id, onFieldChange]);

  const onChange = useCallback(value => onFieldChange(id, value), [
    id,
    onFieldChange,
  ]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(editorId, 'sql', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: 'flowInput',
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, id, formKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId]);

  return (
    <>
      <ActionButton
        data-test={id}
        onClick={handleEditorClick}
        className={classes.editorButton}>
        <ExitIcon />
      </ActionButton>
      <div className={classes.container}>
        <div className={classes.dynaSqlQueryWrapper}>
          <FormLabel className={classes.label}>{label}</FormLabel>
          <FieldHelp {...props} />
        </div>
        <div
          className={clsx(
            classes.inlineEditorContainer,
            editorClassName
          )}>
          <CodeEditor
            name={id}
            value={value}
            mode="sql"
            readOnly={disabled}
            onChange={onChange}
          />
        </div>
        {!isValid && <FormHelperText error>{errorMessages}</FormHelperText>}
      </div>
    </>
  );
}
