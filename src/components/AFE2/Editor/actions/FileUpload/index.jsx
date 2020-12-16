import React from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import DynaUploadFile from '../../../../DynaForm/fields/DynaUploadFile';

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

// this was a prop passed from metadata, but if i examine
// every instance, they are all the same... so may as well
// hard code this.
const uploadSampleDataFieldName = 'uploadFile';

export default function FileUpload({editorId}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { resourceId, resourceType, formKey, fieldId } = useSelector(state => {
    const e = selectors._editor(state, editorId);

    return ({
      resourceId: e.resourceId,
      resourceType: e.resourceType,
      formKey: e.formKey,
      fieldId: e.fieldId,
    });
  }, shallowEqual);

  // This component should render a simple title if there is no form or fieldId.
  // for this to be generic though, we probably can not hardcode "CSV". Possibly
  // this component renders NULL instead? and the upstream code managed the
  // proper default title?
  if (!formKey || !fieldId) return 'Sample CSV file';

  const onFieldChange = (fieldId, value) => {
    dispatch(actions.form.fieldChange(formKey)(fieldId, value));
  };

  return (
    <DynaUploadFile
      resourceId={resourceId}
      resourceType={resourceType}
      onFieldChange={onFieldChange}
      options="csv"
      color=""
      placeholder="Sample CSV file (that would be parsed)"
      id={uploadSampleDataFieldName}
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
