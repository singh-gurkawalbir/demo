import { useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import DynaTableView from './';

export default function DynaNSStaticMap(props) {
  const {
    connectionId = '59e0645e0ae62504287461d0',
    recordType = 'salesorder',
    selectField = 'shipmethod',
    keyName = 'extract',
    keyLabel = 'Export',
    map,
    value,
    valueLabel = 'Import (NetSuite)',
    valueName = 'generate',
  } = props;
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
      type: 'select',
      options: [],
      supportsRefresh: true,
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

  const dispatch = useDispatch();
  const initSelector = state =>
    selectors.optionsMapFromMetadata(
      state,
      connectionId,
      'netsuite',
      recordType,
      selectField,
      optionsMap
    );
  const handleRefreshClick = () => {
    dispatch(
      actions.metadata.request(
        connectionId,
        'recordTypes',
        'suitescript',
        null,
        recordType,
        selectField
      )
    );
  };

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
