/* eslint-disable camelcase */
import React, { useCallback, useState, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ActionButton from '../../ActionButton';
import AfeIcon from '../../icons/AfeIcon';
import DynaTimestampFileName from './DynaTimestampFileName';
import actions from '../../../actions';
import { getValidRelativePath } from '../../../utils/routePaths';
import { IMPORT_FLOW_DATA_STAGE } from '../../../utils/flowData';
import useFormContext from '../../Form/FormContext';
import { drawerPaths, buildDrawerUrl } from '../../../utils/rightDrawer';

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

const VALID_FILE_EXTENSIONS = ['csv', 'json', 'xlsx', 'xml', 'edi'];
export default function DynaFTPFileNameWithEditor_afe(props) {
  const {id, flowId, value = '', resourceId, resourceType, onFieldChange, formKey} = props;
  const {fields} = useFormContext(formKey);
  const fileType = fields['file.type']?.value;
  const fileTypeIsTouched = fields['file.type']?.touched;

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
    dispatch(actions.editor.init(editorId, 'handlebars', {
      formKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: IMPORT_FLOW_DATA_STAGE,
      onSave: handleSave,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, editorId, formKey, flowId, resourceId, resourceType, id, handleSave, history, match.url]);

  const updateFileNameExtension = useCallback(() => {
    const newExtension = [
      'filedefinition',
      'fixed',
      'delimited/edifact',
    ].includes(fileType)
      ? 'edi'
      : fileType;
    let currentExtension;

    if (value.lastIndexOf('.') !== -1) {
      currentExtension = value.substr(value.lastIndexOf('.') + 1);
    }
    if (currentExtension === newExtension) {
      return;
    }
    let newFileName = '';

    if (!value) {
      newFileName = `file-{{timestamp}}.${newExtension}`;
    } else if (VALID_FILE_EXTENSIONS.includes(currentExtension)) {
      newFileName = `${value.substr(0, value.lastIndexOf('.'))}.${newExtension}`;
    } else {
      newFileName = `${value}.${newExtension}`;
    }
    onFieldChange(id, newFileName);
    setSavedFileType(fileType);
  }, [fileType, id, onFieldChange, value]);

  useEffect(() => {
    if (fileTypeIsTouched && fileType && fileType !== savedFileType) {
      // update fileName extension
      updateFileNameExtension();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileType]);

  return (
    <>
      <div className={classes.dynaRowWrapper}>
        <DynaTimestampFileName {...props} />
        <ActionButton
          data-test={id}
          tooltip="Open handlebars editor"
          placement="bottom"
          onClick={handleEditorClick}
          className={classes.dynaActionButton}>
          <AfeIcon />
        </ActionButton>
      </div>
    </>
  );
}
