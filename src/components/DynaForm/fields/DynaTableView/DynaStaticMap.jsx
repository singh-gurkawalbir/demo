import DynaTableView from './DynaTable';

export default function DynaStaticMap(props) {
  const { keyName, keyLabel, valueLabel, valueName, map, value } = props;
  const initSelector = () => ({});
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

  if (map && !value) {
    computedValue = Object.keys(map || {}).map(key => ({
      [keyName]: key,
      [valueName]: map[key],
    }));
  } else {
    computedValue = value;
  }

  return (
    <DynaTableView
      {...props}
      optionsMap={optionsMap}
      initSelector={initSelector}
      value={computedValue}
      handleRefreshClickHandler={handleRefreshClick}
    />
  );
}
