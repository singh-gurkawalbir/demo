import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { FormLabel, Typography } from '@mui/material';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import CodeEditor from '../../../../CodeEditor';
import RightDrawer from '../../../../drawer/Right';
import DrawerHeader from '../../../../drawer/Right/DrawerHeader';
import DrawerContent from '../../../../drawer/Right/DrawerContent';
import DrawerFooter from '../../../../drawer/Right/DrawerFooter';
import { FilledButton } from '../../../../Buttons';
import { drawerPaths } from '../../../../../utils/rightDrawer';
import isLoggableAttr from '../../../../../utils/isLoggableAttr';
import Panels from '../../../../PreviewPanel/Panels';
import FieldHelp from '../../../FieldHelp';
import PopulateWithPreviewData from '../../../../PopulateWithPreviewData';
import {validateMockDataField} from '../../../../../utils/flowDebugger';
import FieldMessage from '../../FieldMessage';
import useResourceFormSampleData from '../../../../../hooks/useResourceFormSampleData';
import ActionGroup from '../../../../ActionGroup';

const useStyles = makeStyles(theme => ({
  content: {
    height: '100%',
  },
  headingWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    fontSize: 18,
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    background: theme.palette.background.paper,
    display: 'flex',
    '& .MuiIconButton-label': {
      height: 22,
    },
  },
  container: {
    background: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderTop: 0,
    padding: theme.spacing(1, 2, 2),
    height: `calc(100vh - ${260}px)`,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  dynaEditorTextLabelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  baseFormWithPreview: {
    display: 'grid',
    gridTemplateColumns: '50% 48%',
    gridColumnGap: theme.spacing(2),
  },
  title: {
    '& > :first-child': {
      marginRight: 0,
      lineHeight: 1,
    },
  },
  inlineEditorContainer: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    height: '100%',
  },
}));

function MockDataDrawerContent() {
  const { formKey, fieldId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const fieldState = useSelector(state => selectors.fieldState(state, formKey, fieldId), shallowEqual);
  const {
    value,
    disabled,
    resourceId,
    resourceType,
    isLoggable,
    flowId,
    required,
    label,
    helpKey,
    errorMessages,
  } = fieldState || {};
  const [errorMessage, setErrorMessage] = useState(errorMessages);
  const [editorContent, setEditorContent] = useState(value);

  const handleClose = useCallback(() => history.goBack(), [history]);

  useEffect(() => {
    if (!fieldState) {
      handleClose();
    }
  }, [fieldState, handleClose]);

  const handleUpdate = useCallback(newVal => {
    setEditorContent(newVal);
    setErrorMessage(validateMockDataField(resourceType, newVal));
  }, [resourceType]);

  const handleDone = () => {
    dispatch(actions.form.fieldChange(formKey)(fieldId, editorContent));
    handleClose();
  };

  const { availablePreviewStages, previewStageDataList, resourceSampleData } = useResourceFormSampleData(resourceType, resourceId, flowId);

  return (
    <>
      <DrawerHeader title={label} handleClose={handleClose} />
      <DrawerContent className={classes.baseFormWithPreview}>
        <div {...isLoggableAttr(isLoggable)} >
          <div className={classes.headingWrapper}>
            <ActionGroup className={classes.title}>
              <Typography variant="body1" >
                {label}
              </Typography>
            </ActionGroup>
            <ActionGroup className={classes.title} position="right">
              <PopulateWithPreviewData
                flowId={flowId}
                fieldId={fieldId}
                formKey={formKey}
                resourceType={resourceType}
                resourceId={resourceId}
                updateMockDataContent={handleUpdate}
              />
            </ActionGroup>
          </div>
          <div className={classes.container}>
            <div className={classes.dynaEditorTextLabelWrapper}>
              <FormLabel required={required} error={!!errorMessage} >{label}</FormLabel>
              <FieldHelp
                id={fieldId}
                helpKey={helpKey}
                label={label}
                noApi
              />
            </div>
            <div className={classes.inlineEditorContainer}>
              <CodeEditor
                name={fieldId}
                value={editorContent}
                mode="json"
                readOnly={disabled}
                onChange={handleUpdate}
              />
            </div>
            <FieldMessage
              errorMessages={errorMessage}
              isValid={!errorMessage}
            />
          </div>
        </div>
        <div>
          <Typography variant="body1" className={classes.headingWrapper}>
            Preview data
          </Typography>
          <div className={classes.container}>
            <Panels.PreviewBodyTabs
              resourceSampleData={resourceSampleData}
              previewStageDataList={previewStageDataList}
              availablePreviewStages={availablePreviewStages}
              resourceId={resourceId}
              showDefaultPreviewBody={!resourceSampleData.status}
              resourceType={resourceType}
            />
          </div>
        </div>
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          data-test="saveContent"
          disabled={value === editorContent || !!errorMessage}
          onClick={handleDone}>
          Done
        </FilledButton>
      </DrawerFooter>
    </>
  );
}

export default function MockDataDrawer() {
  return (
    <RightDrawer
      height="tall"
      width="full"
      path={drawerPaths.RESOURCE_MOCK_DATA}>
      <MockDataDrawerContent />
    </RightDrawer>
  );
}
