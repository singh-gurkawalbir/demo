/* eslint-disable camelcase */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormControl } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../reducers';
import DynaMultiSelect from './DynaMultiSelect';
import actions from '../../../actions';
import { getFileColumns } from '../../../utils/file';
import { processJsonSampleData } from '../../../utils/sampleData';

const useStyles = makeStyles(() => ({
  keyColumnFormWrapper: {
    display: 'flex',
    flexDirection: 'row !important',
  },
}));

const emptySet = [];
const emptyObj = {};

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
    options = emptyObj,
    isLoggable,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const editorId = 'filekeycolumns';
  const parentFormKey = `${resourceType}-${resourceId}`;
  const { data: editorData, previewStatus, result, rule } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  /*
   * Fetches Raw data - CSV file to be parsed based on the rules
   * This field is supported by Csv/Xlsx file types
   */
  const csvData = useSelector(state => selectors.fileSampleData(state, {
    resourceId, resourceType, fileType: options.fileType || 'csv',
  }));

  /*
   * In case of HTTP export, the raw data is saved in its parsed state
   * no need to initiate the editor for evaluated result
   */
  const isHTTPExport = useSelector(state =>
    selectors.fieldState(state, parentFormKey, 'http.successMediaType')?.value === 'csv');

  const resObj = useSelector(state => {
    const { data: rawData } = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'preview',
    );

    if (!rawData) {
      return emptyObj;
    }

    return processJsonSampleData(rawData);
  });

  const multiSelectOptions = useMemo(() => {
    const columns = isHTTPExport ? Object.keys(resObj) : getFileColumns(result);
    const options = columns.map(name => ({ label: name, value: name }));

    if (Array.isArray(value)) {
      value.forEach(val => {
        if (!options.find(opt => opt.value === val)) {
          options.push({ label: val, value: val });
        }
      });
    }

    return [{ items: options }];
  }, [isHTTPExport, resObj, result, value]);

  useEffect(() => {
    if (isHTTPExport) {
      return;
    }
    // this component requires editor only to get the evaluated result of parser
    // and then use it to show options
    dispatch(actions.editor.init(editorId, 'csvParser', {
      resourceId,
      resourceType,
      data: csvData,
      rule: options,
    }));

    return () => dispatch(actions.editor.clear(editorId));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // added editorData truthy check as it gets undefined when editor is cleared
    if (!isHTTPExport && csvData && editorData && csvData !== editorData) {
      dispatch(actions.editor.patchFileKeyColumn(editorId, 'data', csvData));

      onFieldChange(id, []);
    }
  }, [csvData, dispatch, id, editorData, onFieldChange, isHTTPExport]);
  useEffect(() => {
    if (!isHTTPExport && rule) {
      dispatch(actions.editor.patchFileKeyColumn(editorId, 'rule', { ...options }));
    }
  }, [dispatch, isHTTPExport, options, rule]);

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
        onFieldChange={onFieldChange}
    />
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
