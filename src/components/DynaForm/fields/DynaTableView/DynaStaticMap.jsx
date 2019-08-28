import DynaTableView from './';

export default function DynaStaticMap(props) {
  const { keyName, keyLabel, valueLabel, valueName } = props;
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

  return (
    <DynaTableView
      {...props}
      optionsMap={optionsMap}
      initSelector={initSelector}
      handleRefreshClickHandler={handleRefreshClick}
    />
  );
}
