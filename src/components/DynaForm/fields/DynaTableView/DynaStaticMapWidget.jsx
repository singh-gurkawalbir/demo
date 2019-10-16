import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import actions from '../../../../actions';
import * as selectors from '../../../../reducers';
import DynaTableView from './DynaTable';

export default function DynaStaticMap(props) {
  const {
    id,
    _integrationId,
    extracts = [],
    map = {},
    generates = [],
    extractFieldHeader,
    generateFieldHeader,
    supportsExtractsRefresh,
    supportsGeneratesRefresh,
  } = props;
  const computedValue = Object.keys(map).map(key => ({
    extracts: key,
    generates: map[key],
  }));
  const dispatch = useDispatch();
  const optionsMap = [
    {
      id: 'extracts',
      label: extractFieldHeader,
      name: extractFieldHeader,
      required: true,
      type: extracts.length ? 'select' : 'input',
      options: extracts,
      supportsRefresh: supportsExtractsRefresh,
    },
    {
      id: 'generates',
      label: generateFieldHeader,
      name: generateFieldHeader,
      required: true,
      options: generates,
      type: generates.length ? 'select' : 'input',
      supportsRefresh: supportsGeneratesRefresh,
    },
  ];
  const { isLoading, shouldReset, data: metadata } = useSelector(state =>
    selectors.connectorMetadata(state, id, null, _integrationId, optionsMap)
  );

  if (metadata) {
    metadata.optionsMap = [...optionsMap];
    metadata.optionsMap[0].options = metadata.extracts;
    metadata.optionsMap[1].options = metadata.generates;
  }

  const handleRefreshClick = useCallback(
    fieldId => {
      dispatch(actions.connectors.refreshMetadata(fieldId, id, _integrationId));
    },
    [_integrationId, dispatch, id]
  );
  const handleCleanup = useCallback(() => {
    dispatch(actions.connectors.clearMetadata(id, _integrationId));
  }, [_integrationId, dispatch, id]);

  return (
    <DynaTableView
      {...props}
      optionsMap={optionsMap}
      isLoading={isLoading}
      shouldReset={shouldReset}
      metadata={metadata}
      value={computedValue}
      handleRefreshClickHandler={handleRefreshClick}
      handleCleanupHandler={handleCleanup}
    />
  );
}
