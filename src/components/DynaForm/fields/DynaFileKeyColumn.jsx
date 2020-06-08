import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormControl, makeStyles } from '@material-ui/core';
import * as selectors from '../../../reducers';
import DynaMultiSelect from './DynaMultiSelect';
import actions from '../../../actions';
import Spinner from '../../Spinner';

const useStyles = makeStyles(theme => ({
  keyColumnFormWrapper: {
    display: 'flex',
    flexDirection: 'row !important'
  },
  spinnerWrapper: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(4),
    alignSelf: 'flex-start',
  }
}));
const getColumns = result => {
  if (!result || !result.data || !result.data.length) {
    return [];
  }

  const sampleRecord = Array.isArray(result.data[0])
    ? result.data[0][0]
    : result.data[0];

  return Object.keys(sampleRecord).map(name => ({ label: name, value: name }));
};

export default function DynaFileKeyColumn(props) {
  const {
    disabled,
    id,
    name,
    onFieldChange,
    value = [],
    label,
    required,
    resourceId,
    resourceType,
    isValid,
    helpText,
    helpKey,
    options = {},
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [editorInit, setEditorInit] = useState(false);
  const { data, status: csvParseStatus, result } = useSelector(state =>
    selectors.editor(state, id)
  );
  /*
   * Fetches Raw data - CSV file to be parsed based on the rules
   */
  const { csvData } = useSelector(state => {
    const { data: rawData, status } = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'raw'
    );

    if (!status) {
      // Incase of resource edit and no file uploaded, show the csv content uploaded last time ( sampleData )
      const resource = selectors.resource(state, resourceType, resourceId);

      // If the file type is csv before , only then retrieve its content sampleData to show in the editor
      if (resource && resource.file && resource.file.type === 'csv') {
        return { csvData: resource.sampleData };
      }
    }

    return { csvData: rawData && rawData.body };
  });

  const multiSelectOptions = useMemo(() => {
    const options = getColumns(result);

    if (Array.isArray(value)) {
      value.forEach(val => {
        if (!options.find(opt => opt.value === val)) {
          options.push({ label: val, value: val });
        }
      });
    }

    return [{ items: options }];
  }, [result, value]);

  const handleInit = useCallback(() => {
    dispatch(actions.editor.init(id, 'csvParser', {
      data: csvData,
      rule: options,
      autoEvaluate: true,
    }));
  }, [csvData, dispatch, id, options]);


  useEffect(() => {
    if (!editorInit) {
      handleInit();
      setEditorInit(true);
    }
  }, [editorInit, handleInit]);

  useEffect(() => {
    if (editorInit && csvData && csvData !== data) {
      dispatch(actions.editor.patch(id, { data: csvData }));

      onFieldChange(id, []);
    }
  }, [csvData, data, dispatch, editorInit, id, onFieldChange]);

  useEffect(() => {
    if (editorInit) {
      dispatch(actions.editor.patch(id, { ...options }));
    }
  }, [dispatch, editorInit, id, options]);


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
      {csvParseStatus === 'requested' && (<Spinner className={classes.spinnerWrapper} size={24} />)}
    </FormControl>
  );
}
