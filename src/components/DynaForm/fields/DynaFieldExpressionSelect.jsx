import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual } from 'lodash';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import Select from './DynaSelect';

export default function DynaFieldExpressionSelect(props) {
  const {
    label,
    onFieldChange,
    value,
    id,
    name,
    placeholder,
    defaultValue,
    isValid,
  } = props;
  const dispatch = useDispatch();
  const options = useSelector(state => {
    const functions = selectors._editorHelperFunctions(state);
    const optionItems = [];

    Object.keys(functions).forEach(func => {
      optionItems.push({ label: func, value: functions[func] });
    });

    return [
      {
        items: optionItems,
      },
    ];
  }, isEqual);

  useEffect(() => {
    dispatch(actions._editor.refreshHelperFunctions());
  }, [dispatch]);

  return (
    <Select
      data-test={id}
      id={id}
      label={label}
      placeholder={placeholder}
      name={name}
      value={value}
      options={options}
      defaultValue={defaultValue}
      isValid={isValid}
      onFieldChange={onFieldChange}
    />
  );
}
