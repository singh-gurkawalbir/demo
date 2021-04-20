import React, { useCallback, useEffect, useMemo } from 'react';
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
    keyOptions,
    valueOptions,
  } = props;
  // TODO: (Aditya/Sravan) DynaTable to accept a single value and conversion to be made inside component.Check for validations and how error message will be displayed in case of incomplete map
  // if map is being passed instead of value, trigger a onFieldChange with formatted value
  const handleRefreshClick = useCallback(() => {}, []);
  const optionsMap = useMemo(() => [
    {
      id: keyName,
      label: keyLabel,
      required: true,
      options: keyOptions,
      type: keyOptions ? 'autosuggest' : 'input',
      supportsRefresh: false,
    },
    {
      id: valueName,
      label: valueLabel,
      required: true,
      options: valueOptions,
      type: valueOptions ? 'autosuggest' : 'input',
      supportsRefresh: false,
    },
  ], [keyLabel, keyName, keyOptions, valueLabel, valueName, valueOptions]);

  const computedValue = useMemo(() => {
    // giving preference to map if present in props
    if (map) {
      return Object.keys(map).map(key => ({
        [keyName]: key,
        [valueName]: map[key],
      }));
    }

    return value;
  }, [keyName, map, value, valueName]);

  useEffect(() => {
    if (map) {
      onFieldChange(id, computedValue, true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DynaTableView
      {...props}
      optionsMap={optionsMap}
      value={computedValue}
      handleRefreshClickHandler={handleRefreshClick}
    />
  );
}
