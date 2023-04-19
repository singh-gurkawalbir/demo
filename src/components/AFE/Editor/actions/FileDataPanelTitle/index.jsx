import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import DynaUploadFile from '../../../../DynaForm/fields/DynaUploadFile';
import { isFileAdaptor } from '../../../../../utils/resource';

// Refer to DynaForm/fields/DynaUploadFile/FileUploader/jsx for
// class names.
const useStyles = makeStyles(theme => ({
  labelWrapper: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  uploadFile: {
    justifyContent: 'flex-end',
    background: 'transparent !important',
    border: '0px !important',
    width: 'auto !important',
    padding: theme.spacing(0.5),
  },
  errorContainer: {
    marginBottom: theme.spacing(0.5),
  },
  label: {
    fontSize: 17,
  },
}));

export default function FileDataPanelTitle({editorId, fileType}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const { resourceId, resourceType, formKey, fieldId, isSuiteScriptData } = useSelector(state => {
    const e = selectors.editor(state, editorId);

    return ({
      resourceId: e.resourceId,
      resourceType: e.resourceType,
      formKey: e.formKey,
      fieldId: e.fieldId,
      isSuiteScriptData: e.isSuiteScriptData,
    });
  }, shallowEqual);
  const resource = useSelector(state => selectors.resource(state, resourceType, resourceId));

  const onFieldChange = (fieldId, value) => {
    dispatch(actions.form.fieldChange(formKey)(fieldId, value));
  };

  // upload file option is only available for file adaptors (ftp, s3, simple)
  if (!isSuiteScriptData && (!fieldId || !formKey || resourceType !== 'exports' || !isFileAdaptor(resource))) {
    return `Sample ${fileType.toUpperCase()} file`;
  }

  return (
    <DynaUploadFile
      disabled={disabled}
      resourceId={resourceId}
      resourceType={resourceType}
      onFieldChange={onFieldChange}
      options={fileType}
      placeholder={`Sample ${fileType.toUpperCase()} file (that would be parsed)`}
      id="uploadFile"
      persistData
      hideFileName
      variant="text"
      classProps={classes}
      formKey={formKey}
    />
  );
}
