/* eslint-disable camelcase */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormControl, makeStyles } from '@material-ui/core';
import { selectors } from '../../../reducers';
import DynaMultiSelect from './DynaMultiSelect';
import actions from '../../../actions';
import DynaKeyValue from './DynaKeyValue';

const emptySet = [];
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

export default function DynaSortAndGroup(props) {
  const {
    resourceId,
    formKey,
    id,
    disabled,
    name,
    onFieldChange,
    value = emptySet,
    label,
    required,
    isValid,
    helpText,
    helpKey,
    enableSorting,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  const { data, status} = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'parse'),
  );
  const sampleData = Array.isArray(data) ? data[0] : data;

  useEffect(() => {
    if (!status) {
      dispatch(actions.resourceFormSampleData.request(formKey));
    }
  }, [dispatch, formKey, status]);

  const suggestionConfig = useMemo(() => {
    let options = Object.keys(sampleData || {});

    options = options.map(name => ({ id: name}));

    return { keyConfig: {
      suggestions: options,
      labelName: 'id',
      valueName: 'id',
    } };
  }, [sampleData]);
  const multiSelectOptions = useMemo(() => {
    let options = Object.keys(sampleData || {});

    options = options.map(name => ({ label: name, value: name}));

    if (Array.isArray(value)) {
      value.forEach(val => {
        if (!options.find(opt => opt.value === val)) {
          options.push({ label: val, value: val });
        }
      });
    }

    return [{ items: options }];
  }, [sampleData, value]);

  if (enableSorting) {
    return (
      <DynaKeyValue
        {...props}
        suggestionConfig={suggestionConfig}
        selectView
        showHeaderLabels
        keyLabel="Field"
        valueLabel="Order" />
    );
  }

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
    </FormControl>
  );
}
