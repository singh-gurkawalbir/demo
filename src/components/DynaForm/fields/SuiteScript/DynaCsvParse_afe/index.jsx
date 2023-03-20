/* eslint-disable camelcase */
import React, { useState, useCallback, useRef } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Button, FormLabel } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import actions from '../../../../../actions';
import FieldHelp from '../../../FieldHelp';
import getFormMetadata from '../../../../AFE/Editor/panels/CsvParseRules/suitescript/formMeta';
import DynaForm from '../../..';
import { useUpdateParentForm } from '../../DynaCsvGenerate_afe';
import { generateNewId } from '../../../../../utils/resource';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import useSetSubFormShowValidations from '../../../../../hooks/useSetSubFormShowValidations';
import { getValidRelativePath } from '../../../../../utils/routePaths';
import FileDataChange from '../../DynaCsvParse_afe/FileDataChange';
import { buildDrawerUrl, drawerPaths } from '../../../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  button: {
    maxWidth: 100,
  },
  label: {
    marginBottom: 6,
  },
  labelWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
  },
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
    padding: 4,
  },
  uploadFileErrorContainer: {
    marginBottom: 4,
  },
  fileUPloadBtnLabel: {
    fontSize: 17,
  },
}));

const getParserValue = ({
  columnDelimiter,
  rowDelimiter,
  hasHeaderRow,
  keyColumns,
  rowsPerRecord,
}) => ({
  columnDelimiter,
  rowDelimiter,
  hasHeaderRow,
  keyColumns,
  rowsPerRecord,
});

export default function DynaCsvParse_afe(props) {
  const {
    id,
    onFieldChange,
    label,
    value,
    resourceId,
    resourceType,
    disabled,
    ssLinkedConnectionId,
    formKey: parentFormKey,
    flowId,
  } = props;
  const classes = useStyles();
  const [remountKey, setRemountKey] = useState(1);
  const secondaryFormKey = useRef(generateNewId());
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

  const [form, setForm] = useState(getFormMetadata({...value, resourceId, resourceType, ssLinkedConnectionId }));

  const handleFormChange = useCallback(
    (newOptions, isValid, touched) => {
      const parsersValue = getParserValue(newOptions);

      // TODO: HACK! add an obscure prop to let the validationHandler defined in
      // the formFactory.js know that there are child-form validation errors
      if (!isValid) {
        onFieldChange(id, { ...parsersValue, __invalid: true }, touched);
      } else {
        onFieldChange(id, parsersValue, touched);
      }
    },
    [id, onFieldChange]
  );

  const handleSave = useCallback((editorValues = {}) => {
    const { rule } = editorValues;
    const parsedVal = getParserValue(rule);

    setForm(getFormMetadata({...rule, resourceId, resourceType, ssLinkedConnectionId}));
    setRemountKey(remountKey => remountKey + 1);
    onFieldChange(id, parsedVal);
  }, [id, onFieldChange, resourceId, resourceType, ssLinkedConnectionId]);

  useUpdateParentForm(secondaryFormKey.current, handleFormChange);
  useSetSubFormShowValidations(parentFormKey, secondaryFormKey.current);
  const formKeyComponent = useFormInitWithPermissions({
    formKey: secondaryFormKey.current,
    remount: remountKey,
    optionsHandler: form?.optionsHandler,
    disabled,
    fieldMeta: form,
  });

  const handleEditorClick = useCallback(() => {
    dispatch(actions.editor.init(editorId, 'csvParser', {
      formKey: parentFormKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      onSave: handleSave,
      isSuiteScriptData: true,
      ssLinkedConnectionId,
    }));

    history.push(buildDrawerUrl({
      path: drawerPaths.EDITOR,
      baseUrl: match.url,
      params: { editorId },
    }));
  }, [dispatch, id, parentFormKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId, ssLinkedConnectionId]);

  return (
    <>
      <div className={classes.container}>
        {/* todo: FileDataChange is a temporary hack until Raghu's changes are
        done re dispatching of SAMPLEDATA_UPDATED action to update editor sample data */}
        <FileDataChange editorId={editorId} fileType="csv" />
        <div className={classes.labelWrapper}>
          <FormLabel className={classes.label}>{label}</FormLabel>
          <FieldHelp {...props} />
        </div>
        <Button
          data-test={id}
          variant="outlined"
          color="secondary"
          className={classes.button}
          onClick={handleEditorClick}>
          Launch
        </Button>
      </div>
      <DynaForm
        formKey={formKeyComponent}
      />
    </>
  );
}
