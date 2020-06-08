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
    isValid,
    helpText,
    helpKey,
    options = {},
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [editorInit, setEditorInit] = useState(false);
  // const [sampleData, setSampleData] = useState(props.sampleData || '');
  const { data, status: csvParseStatus, result } = useSelector(state =>
    selectors.editor(state, id)
  );
  const { data: csvData } = useSelector(state => {
    const rawData = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'csv'
    );

    return { data: rawData && rawData.data && rawData.data.body };
  });

  // const { data: parsedData } = useSelector(state =>
  //   selectors.getResourceSampleDataWithStatus(state, resourceId, 'parse')
  // );

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
    if (csvData && csvData !== data) {
      dispatch(actions.editor.patch(id, { data: csvData }));

      onFieldChange(id, []);
    }
  }, [csvData, data, dispatch, id, onFieldChange]);


  useEffect(() => {
    if (!editorInit) {
      handleInit();
      setEditorInit(true);
    }
  }, [editorInit, handleInit]);

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
      {csvParseStatus === 'requested' && (<Spinner className={classes.spinnerWrapper} size={16} />)}
    </FormControl>
  );
}
