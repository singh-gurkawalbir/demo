/* eslint-disable camelcase */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormControl } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import DynaMultiSelect from '../DynaMultiSelect';
import actions from '../../../../actions';
import { getFileColumns } from '../../../../utils/file';

const useStyles = makeStyles(() => ({
  keyColumnFormWrapper: {
    display: 'flex',
    flexDirection: 'row !important',

  },
}));

const emptySet = [];
const emptyObj = {};
const editorId = 'ssfilekeycolumns';

export default function DynaFileKeyColumn_afe(props) {
  const {
    disabled,
    id,
    name,
    onFieldChange,
    value = emptySet,
    label,
    required,
    resourceId,
    resourceType,
    isValid,
    helpText,
    helpKey,
    integrationId,
    ssLinkedConnectionId,
    isLoggable,
    options = emptyObj,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { data: editorData, previewStatus, result } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  /*
   * Fetches Raw data - CSV file to be parsed based on the rules
   * This field is supported by Csv/Xlsx file types
   */
  const csvData = useSelector(state => selectors.suiteScriptFileExportSampleData(state, {
    resourceId, resourceType, integrationId, ssLinkedConnectionId, fileType: options.fileType || 'csv',
  }));

  const multiSelectOptions = useMemo(() => {
    const columns = getFileColumns(result);
    const options = columns.map(name => ({ label: name, value: name }));

    if (Array.isArray(value)) {
      value.forEach(val => {
        if (!options.find(opt => opt.value === val)) {
          options.push({ label: val, value: val });
        }
      });
    }

    return [{ items: options }];
  }, [result, value]);

  useEffect(() => {
    // this component requires editor only to get the evaluated result of parser
    // and then use it to show options
    dispatch(actions.editor.init(editorId, 'csvParser', {
      resourceId,
      resourceType,
      data: csvData,
      rule: options,
      isSuiteScriptData: true,
    }));

    return () => dispatch(actions.editor.clear(editorId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // added editorData truthy check as it gets undefined when editor is cleared
    if (csvData && editorData && csvData !== editorData) {
      dispatch(actions.editor.patchFileKeyColumn(editorId, 'data', csvData));

      onFieldChange(id, []);
    }
  }, [csvData, dispatch, id, editorData, onFieldChange]);

  useEffect(() => {
    dispatch(actions.editor.patchFileKeyColumn(editorId, 'rule', { ...options }));
  }, [dispatch, options]);

  return (
    <FormControl
      variant="standard"
      key={id}
      disabled={disabled}
      className={classes.keyColumnFormWrapper}>
      <DynaMultiSelect
        isLoggable={isLoggable}
        disabled={disabled}
        id={id}
        label={label}
        value={value}
        helpText={helpText}
        helpKey={helpKey}
        isValid={isValid}
        name={name}
        options={multiSelectOptions}
        required={required}
        onFieldChange={onFieldChange} />
      {previewStatus === 'requested' && (
      <Spinner
        sx={{
          ml: 1,
          mt: 4,
          alignSelf: 'flex-start'}} />
      )}
    </FormControl>
  );
}
