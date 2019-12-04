import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import DynaTableView from './DynaTable';

export default function DynaMultiSubsidiaryMapping(props) {
  const { optionsMap, _integrationId, id } = props;
  const modifiedOptionsMap = optionsMap.map(option => ({
    ...option,
    supportsRefresh: option.id !== 'dummyCustomer',
  }));
  const dispatch = useDispatch();
  const { isLoading, shouldReset, data: metadata } = useSelector(state =>
    selectors.connectorMetadata(state, id, null, _integrationId, optionsMap)
  );
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
      collapsable
      hideLabel
      isLoading={isLoading}
      shouldReset={shouldReset}
      metadata={metadata}
      handleCleanupHandler={handleCleanup}
      handleRefreshClickHandler={handleRefreshClick}
      optionsMap={modifiedOptionsMap}
    />
  );
}
