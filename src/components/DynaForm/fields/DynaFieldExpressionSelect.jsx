import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../reducers';
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
    resetAfterSelection,
    defaultValue,
    isValid,
  } = props;
  const dispatch = useDispatch();
  const handleInit = useCallback(() => {
    dispatch(actions.editor.refreshHelperFunctions());
  }, [dispatch]);

  useEffect(() => {
    handleInit();
  }, [handleInit]);
  const fieldExpressions = useSelector(state =>
    selectors.editorHelperFunctions(state)
  );
  const optionItems = [];

  Object.keys(fieldExpressions).forEach(func => {
    optionItems.push({ label: func, value: fieldExpressions[func] });
  });

  const options = [
    {
      items: optionItems,
    },
  ];

  return (
    <Select
      data-test={id}
      resetAfterSelection={resetAfterSelection}
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
