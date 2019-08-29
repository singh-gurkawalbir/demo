import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import DynaTableView from './DynaTable';

export default function DynaSFStaticMap(props) {
  const {
    connectionId,
    recordType,
    selectField,
    keyName = 'extract',
    keyLabel = 'Export',
    map,
    value,
    valueLabel = 'Import (Salesforce)',
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
  const { isLoading, shouldReset, data: metadata } = useSelector(state =>
    selectors.optionsMapFromMetadata(
      state,
      connectionId,
      'salesforce',
      recordType,
      selectField,
      optionsMap
    )
  );
  const handleRefreshClick = () => {
    dispatch(
      actions.metadata.request(
        connectionId,
        'sObjectTypes',
        null,
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
      isLoading={isLoading}
      shouldReset={shouldReset}
      metadata={metadata}
      value={computedValue}
      handleRefreshClickHandler={handleRefreshClick}
    />
  );
}
