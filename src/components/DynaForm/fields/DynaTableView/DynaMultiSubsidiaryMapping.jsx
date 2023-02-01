import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useMemo } from 'react';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import DynaTableView from './DynaTable';
import { customCloneDeep } from '../../../../utils/customCloneDeep';

const addSupportsRefreshToOptions = option => ({
  ...option,
  supportsRefresh: [
    'paymentAccount',
    'subsidiary',
    'debitAccount',
    'depositAccount',
  ].includes(option.id),
});
export default function DynaMultiSubsidiaryMapping(props) {
  const { optionsMap, _integrationId, id } = props;

  const modifiedOptionsMap = useMemo(() => optionsMap.map(addSupportsRefreshToOptions), [optionsMap]);
  const dispatch = useDispatch();
  const { isLoading, shouldReset, data, fieldType } = useSelector(
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

  const metadata = useMemo(() => {
    const formattedData = customCloneDeep(data);

    if (formattedData && formattedData.optionsMap && Array.isArray(formattedData.optionsMap)) {
      formattedData.optionsMap = formattedData.optionsMap.map(addSupportsRefreshToOptions);
    }

    return formattedData;
  }, [data]);
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
