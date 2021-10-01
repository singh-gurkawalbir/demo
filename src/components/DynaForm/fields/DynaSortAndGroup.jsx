/* eslint-disable camelcase */
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import DynaKeyValue from './DynaKeyValue';
import DynaSelectMultiApplication from './DynaSelectMultiApplication';

const emptySet = [];
export default function DynaSortAndGroup(props) {
  const {
    resourceId,
    formKey,
    value = emptySet,
    enableSorting,
  } = props;
  const dispatch = useDispatch();

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
