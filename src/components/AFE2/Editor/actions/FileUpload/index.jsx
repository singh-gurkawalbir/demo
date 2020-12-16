import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import DynaUploadFile from '../../../../DynaForm/fields/DynaUploadFile';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import {isFileAdaptor} from '../../../../../utils/resource';

const useStyles = makeStyles(theme => ({
  fileUploadLabelWrapper: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 'auto',

  },
  fileUploadRoot: {
    width: '100%',
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',

  },
  uploadContainer: {
    justifyContent: 'flex-end',
    background: 'transparent !important',
    border: '0px !important',
    width: 'auto !important',
    padding: theme.spacing(0.5),
  },
  uploadFileErrorContainer: {
    marginBottom: theme.spacing(0.5),
  },
}));

export default function FileUpload({editorId, fileType}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const { resourceId, resourceType, formKey, fieldId } = useSelector(state => {
    const e = selectors._editor(state, editorId);

    return ({
      resourceId: e.resourceId,
      resourceType: e.resourceType,
      formKey: e.formKey,
      fieldId: e.fieldId,
    });
  }, shallowEqual);
  const { merged: resourceData = {} } = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  );

  const onFieldChange = (fieldId, value) => {
    dispatch(actions.form.fieldChange(formKey)(fieldId, value));
  };

  // upload file option is only available for file adaptors (ftp, s3, simple)
  if (!fieldId || !formKey || resourceType !== 'exports' || !isFileAdaptor(resourceData)) {
    return `Sample ${fileType.toUpperCase()} file`;
  }

  return (
    <DynaUploadFile
      disabled={disabled}
      resourceId={resourceId}
      resourceType={resourceType}
      onFieldChange={onFieldChange}
      options={fileType}
      color=""
      placeholder={`Sample ${fileType.toUpperCase()} file (that would be parsed)`}
      id="uploadFile"
      persistData
      hideFileName
      variant="text"
      classProps={
        {
          root: classes.fileUploadRoot,
          labelWrapper: classes.fileUploadLabelWrapper,
          uploadFile: classes.uploadContainer,
          actionContainer: classes.actionContainer,
          errorContainer: classes.uploadFileErrorContainer,
        }
      }
    />
  );
}
