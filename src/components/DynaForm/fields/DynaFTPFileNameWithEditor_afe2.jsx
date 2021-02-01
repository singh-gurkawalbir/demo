/* eslint-disable camelcase */
import React, { useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ActionButton from '../../ActionButton';
import AfeIcon from '../../icons/AfeIcon';
import DynaTimestampFileName from './DynaTimestampFileName';
import actions from '../../../actions';
import { getValidRelativePath } from '../../../utils/routePaths';
import useFormContext from '../../Form/FormContext';

const useStyles = makeStyles(theme => ({
  dynaActionButton: {
    float: 'right',
    marginLeft: theme.spacing(1),
    alignSelf: 'flex-start',
    marginTop: theme.spacing(4),
    background: 'transparent',
  },
  dynaRowWrapper: {
    display: 'flex',
    flexDirection: 'row !important',
  },
}));

export default function DynaFTPFileNameWithEditor_afe2(props) {
  const {id, flowId, value, resourceId, resourceType, onFieldChange, formKey} = props;
  const {value: formValue} = useFormContext(formKey);
  const fileType = formValue['/file/type'];
  const [savedFileType, setSavedFileType] = useState(fileType);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);
  const handleSave = useCallback(editorValues => {
    onFieldChange(id, editorValues.rule);
  }, [id, onFieldChange]);

  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(editorId, 'handlebars', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: 'flowInput',
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, editorId, formKey, flowId, resourceId, resourceType, id, handleSave, history, match.url]);

  const updateFileNameExtension = useCallback(() => {
    if (!value) {
      return;
    }
    const newExtension = [
      'filedefinition',
      'fixed',
      'delimited/edifact',
    ].includes(fileType)
      ? 'edi'
      : fileType;
    const lastDotPos = value.lastIndexOf('.');
    const newFileName = `${lastDotPos !== -1 ? value.substr(0, lastDotPos) : value}.${newExtension}`;

    onFieldChange(id, newFileName);
    setSavedFileType(fileType);
  }, [fileType, id, onFieldChange, value]);

  useEffect(() => {
    if (fileType !== savedFileType) {
      // change fileName extension
      updateFileNameExtension();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileType]);

  return (
    <>
      <div className={classes.dynaRowWrapper}>
        <DynaTimestampFileName
          {...props}
    />
        <ActionButton
          data-test={id}
          onClick={handleEditorClick}
          className={classes.dynaActionButton}>
          <AfeIcon />
        </ActionButton>
      </div>
    </>
  );
}
