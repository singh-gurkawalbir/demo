import React, { useState, useMemo, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, FormLabel } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import actions from '../../../../../actions';
import FieldHelp from '../../../FieldHelp';
// import DynaUploadFile from '../../DynaUploadFile';
import getFormMetadata from '../DynaCsvParse/metadata';
import DynaForm from '../../..';
import {useUpdateParentForm} from '../DynaCsvGenerate';
import { generateNewId } from '../../../../../utils/resource';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import useSetSubFormShowValidations from '../../../../../hooks/useSetSubFormShowValidations';
import { getValidRelativePath } from '../../../../../utils/routePaths';

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
}));

const getParserValue = ({
  columnDelimiter,
  rowDelimiter,
  hasHeaderRow,
  keyColumns,
  rowsToSkip,
  trimSpaces,
}) => ({
  columnDelimiter,
  rowDelimiter,
  hasHeaderRow,
  keyColumns,
  trimSpaces,
  rowsToSkip: Number.isInteger(rowsToSkip) ? rowsToSkip : 0,
});

export default function _DynaCsvParse_(props) {
  const {
    id,
    onFieldChange,
    label,
    value,
    resourceId,
    resourceType,
    disabled,
    // uploadSampleDataFieldName,
    formKey: parentFormKey,
    flowId,
  } = props;
  const classes = useStyles();
  const [remountKey, setRemountKey] = useState(1);
  const [secondaryFormKey] = useState(generateNewId());
  const dispatch = useDispatch();
  const history = useHistory();
  const match = useRouteMatch();
  const editorId = getValidRelativePath(id);

  const getInitOptions = useCallback(
    val => {
      if (!('trimSpaces' in val)) {
        return {...val, trimSpaces: true};
      }

      return val;
    },
    [],
  );
  const initOptions = useMemo(() => getInitOptions(value), [getInitOptions, value]);
  const [form, setForm] = useState(getFormMetadata({...initOptions, resourceId, resourceType}));

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

    setForm(getFormMetadata({...rule, resourceId, resourceType}));
    setRemountKey(remountKey => remountKey + 1);
    onFieldChange(id, parsedVal);

    // todo: @raghu removing this dispatch action from here as it will be taken care
    // by field change on the form itself. Please confirm and remove this comment
    // dispatch(
    //   actions.sampleData.request(
    //     resourceId,
    //     resourceType,
    //     {
    //       type: 'csv',
    //       // file: csvData,
    //       editorValues,
    //     },
    //     'file'
    //   )
    // );
  }, [id, onFieldChange, resourceId, resourceType]);

  // todo @dave this title is used for Data panel.
  // looks like the new editor component would require some changes to support this, pls check
  // const editorDataTitle = useMemo(
  //   () => {
  //     if (uploadSampleDataFieldName) {
  //       return (
  //         <DynaUploadFile
  //           resourceId={resourceId}
  //           resourceType={resourceType}
  //           onFieldChange={onFieldChange}
  //           options="csv"
  //           color=""
  //           placeholder="Sample CSV file (that would be parsed)"
  //           id={uploadSampleDataFieldName}
  //           persistData
  //           hideFileName
  //           variant="text"
  //           classProps={
  //             {
  //               root: classes.fileUploadRoot,
  //               labelWrapper: classes.fileUploadLabelWrapper,
  //               uploadFile: classes.uploadContainer,
  //               actionContainer: classes.actionContainer,
  //               errorContainer: classes.uploadFileErrorContainer,
  //             }
  //           }
  //         />
  //       );
  //     }
  //   },

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [uploadSampleDataFieldName]
  // );

  useUpdateParentForm(secondaryFormKey, handleFormChange);
  useSetSubFormShowValidations(parentFormKey, secondaryFormKey);
  const formKeyComponent = useFormInitWithPermissions({
    formKey: secondaryFormKey,
    remount: remountKey,
    optionsHandler: form?.optionsHandler,
    disabled,
    fieldMeta: form,
  });

  const handleEditorClick = useCallback(() => {
    dispatch(actions._editor.init(editorId, 'csvParser', {
      formKey: parentFormKey,
      flowId,
      resourceId,
      resourceType,
      fieldId: id,
      stage: 'flowInput',
      onSave: handleSave,
    }));

    history.push(`${match.url}/editor/${editorId}`);
  }, [dispatch, id, parentFormKey, flowId, resourceId, resourceType, handleSave, history, match.url, editorId]);

  return (
    <>
      <div className={classes.container}>
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
        fieldMeta={form}
      />
    </>
  );
}
