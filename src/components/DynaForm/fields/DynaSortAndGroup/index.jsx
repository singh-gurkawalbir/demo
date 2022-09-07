/* eslint-disable camelcase */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import DynaKeyValue from '../DynaKeyValue';
import DynaSelectMultiApplication from '../DynaSelectMultiApplication';

const emptySet = [];
export default function DynaSortAndGroup(props) {
  const {
    resourceId,
    formKey,
    value = emptySet,
    enableSorting,
    resourceSubType,
  } = props;
  const dispatch = useDispatch();

  const { data, status} = useSelector(state =>
    selectors.getResourceSampleDataWithStatus(state, resourceId, 'parse'),
  );
  const finalOptions = useMemo(() => {
    const sampleData = Array.isArray(data) ? data[0] : data;
    const options = Object.keys(sampleData || {});

    if (resourceSubType !== 'http' && resourceSubType !== 'rdbms') {
      return options;
    }

    return options.map((name, index) =>
      resourceSubType === 'rdbms' ? `Column${index}` : name
    ).filter(opt =>
      !sampleData[opt] || (
        typeof sampleData[opt] === 'string' ||
        typeof sampleData[opt] === 'number' ||
        typeof sampleData[opt] === 'boolean'
      ));
  }, [data, resourceSubType]);

  useEffect(() => {
    if (!status) {
      dispatch(actions.resourceFormSampleData.request(formKey));
    }
  }, [dispatch, formKey, status]);

  const suggestionConfig = useMemo(() => {
    const options = finalOptions.map(name => ({ id: name}));

    return { keyConfig: {
      suggestions: options,
      labelName: 'id',
      valueName: 'id',
    } };
  }, [finalOptions]);
  const multiSelectOptions = useMemo(() => {
    const options = finalOptions.map(name => ({ label: name, value: name}));

    if (Array.isArray(value)) {
      value.forEach(val => {
        if (!options.find(opt => opt.value === val)) {
          options.push({ label: val, value: val });
        }
      });
    }

    return [{ items: options }];
  }, [finalOptions, value]);

  if (enableSorting) {
    return (
      <DynaKeyValue
        {...props}
        suggestionConfig={suggestionConfig}
        showSortOrder
        showHeaderLabels
        keyLabel="Field"
        valueLabel="Order" />
    );
  }

  return (
    <DynaSelectMultiApplication
      {...props}
      creatableMultiSelect
      hideApplicationImg
      options={multiSelectOptions} />
  );
}
