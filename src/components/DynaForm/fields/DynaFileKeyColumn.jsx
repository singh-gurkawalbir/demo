import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormControl, makeStyles } from '@material-ui/core';
import { selectors } from '../../../reducers';
import DynaMultiSelect from './DynaMultiSelect';
import actions from '../../../actions';
import Spinner from '../../Spinner';
import { getFileColumns } from '../../../utils/file';

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

export default function DynaFileKeyColumn(props) {
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
  const [editorInit, setEditorInit] = useState(false);
  const { data, status: csvParseStatus, result } = useSelector(state =>
    selectors.editor(state, id)
  );
  /*
   * Fetches Raw data - CSV file to be parsed based on the rules
   * This field is supported by Csv/Xlsx file types
   */
  const csvData = useSelector(state => selectors.fileSampleData(state, {
    resourceId, resourceType, fileType: options.fileType || 'csv',
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
  const isCsvDataDifferent = csvData !== data;

  useEffect(() => {
    // csvData !== data pushed outside the useeffect and used simple boolean evaluation used(isCsvDataDifferent)
    if (editorInit && csvData && isCsvDataDifferent) {
      dispatch(actions.editor.patch(id, { data: csvData }));

      onFieldChange(id, []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvData, dispatch, editorInit, id, isCsvDataDifferent]);
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
      {csvParseStatus === 'requested' && (<Spinner className={classes.spinnerWrapper} />)}
    </FormControl>
  );
}
