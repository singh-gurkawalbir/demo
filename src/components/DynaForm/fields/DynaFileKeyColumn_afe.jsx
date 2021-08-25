/* eslint-disable camelcase */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormControl, makeStyles } from '@material-ui/core';
import { selectors } from '../../../reducers';
import DynaMultiSelect from './DynaMultiSelect';
import actions from '../../../actions';
import Spinner from '../../Spinner';
import { getFileColumns } from '../../../utils/file';
import { processJsonSampleData } from '../../../utils/sampleData';

const useStyles = makeStyles(theme => ({
  keyColumnFormWrapper: {
    display: 'flex',
    flexDirection: 'row !important',
  },
  spinnerWrapper: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(4),
    alignSelf: 'flex-start',
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
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const editorId = 'filekeycolumns';
  const { data: editorData, previewStatus, result } = useSelector(state =>
    selectors.editor(state, editorId)
  );
  /*
   * Fetches Raw data - CSV file to be parsed based on the rules
   * This field is supported by Csv/Xlsx file types
   */
  const csvData = useSelector(state => selectors.fileSampleData(state, {
    resourceId, resourceType, fileType: options.fileType || 'csv',
  }));

  const resourceObj = useSelector(state => selectors.resource(state, resourceType, resourceId)) || emptyObj;
  const isHTTPExport = !!(resourceObj.adaptorType === 'HTTPExport' && !resourceObj.assistant && !resourceObj._rest);
  const { data: rawData } = useSelector(state => selectors.getResourceSampleDataWithStatus(
    state,
    resourceId,
    'preview',
  ));
  const resObj = processJsonSampleData(rawData);

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
    // this component requires editor only to get the evaluated result of parser
    // and then use it to show options
    if (!isHTTPExport) {
      dispatch(actions.editor.init(editorId, 'csvParser', {
        resourceId,
        resourceType,
        data: csvData,
        rule: options,
      }));
    }

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
    dispatch(actions.editor.patchFileKeyColumn(editorId, 'rule', { ...options }));
  }, [dispatch, options]);

  return (
    <FormControl
      key={id}
      disabled={disabled}
      className={classes.keyColumnFormWrapper}>
      <DynaMultiSelect
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
      {previewStatus === 'requested' && (<Spinner className={classes.spinnerWrapper} />)}
    </FormControl>
  );
}
