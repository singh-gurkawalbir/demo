import { useEffect, useState } from 'react';
import DynaTableView from './DynaTable';

export default function DynaStaticMap(props) {
  const {
    keyName,
    keyLabel,
    valueLabel,
    valueName,
    map,
    value,
    id,
    onFieldChange,
  } = props;
  // TODO: (Aditya/Sravan) DynaTable to accept a single value and conversion to be made inside component.Check for validations and how error message will be displayed in case of incomplete map
  // if map is being passed instead of value, trigger a onFieldChange with formatted value
  const [initFieldChange, setInitFieldChange] = useState(false);
  const handleRefreshClick = () => {};
  const optionsMap = [
    {
      id: keyName,
      label: keyLabel,
      required: true,
      type: 'input',
      supportsRefresh: false,
    },
    {
      id: valueName,
      label: valueLabel,
      required: true,
      type: 'input',
      supportsRefresh: false,
    },
  ];
  let computedValue;

  // giving preference to map if present in props
  if (map) {
    computedValue = Object.keys(map).map(key => ({
      [keyName]: key,
      [valueName]: map[key],
    }));
  } else {
    computedValue = value;
  }

  useEffect(() => {
    if (!initFieldChange && map) {
      setInitFieldChange(true);
      onFieldChange(id, computedValue);
    }
  }, [computedValue, id, initFieldChange, map, onFieldChange]);

  return (
    <DynaTableView
      {...props}
      optionsMap={optionsMap}
      value={computedValue}
      handleRefreshClickHandler={handleRefreshClick}
    />
  );
}
