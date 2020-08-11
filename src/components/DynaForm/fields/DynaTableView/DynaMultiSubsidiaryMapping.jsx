import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useMemo } from 'react';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import DynaTableView from './DynaTable';

export default function DynaMultiSubsidiaryMapping(props) {
  const { optionsMap, _integrationId, id } = props;
  const addSupportsRefreshToOptions = option => ({
    ...option,
    supportsRefresh: [
      'paymentAccount',
      'subsidiary',
      'debitAccount',
      'depositAccount',
    ].includes(option.id),
  });
  const modifiedOptionsMap = optionsMap.map(addSupportsRefreshToOptions);
  const dispatch = useDispatch();
  const { isLoading, shouldReset, data: metadata, fieldType } = useSelector(
    state =>
      selectors.connectorMetadata(state, id, null, _integrationId, optionsMap)
  );
  const handleRefreshClick = useCallback(
    fieldId => {
      dispatch(
        actions.connectors.refreshMetadata(fieldId, id, _integrationId, {
          key: 'columnName',
        })
      );
    },
    [_integrationId, dispatch, id]
  );
  const handleCleanup = useCallback(() => {
    dispatch(actions.connectors.clearMetadata(id, _integrationId));
  }, [_integrationId, dispatch, id]);

  if (metadata && metadata.optionsMap && Array.isArray(metadata.optionsMap)) {
    metadata.optionsMap = metadata.optionsMap.map(addSupportsRefreshToOptions);
  }

  const isLoadingMap = useMemo(() => ({[fieldType]: isLoading}), [fieldType, isLoading]);

  return (
    <DynaTableView
      {...props}
      hideLabel
      isLoading={isLoadingMap}
      shouldReset={shouldReset}
      metadata={metadata}
      handleCleanupHandler={handleCleanup}
      handleRefreshClickHandler={handleRefreshClick}
      optionsMap={modifiedOptionsMap}
    />
  );
}
