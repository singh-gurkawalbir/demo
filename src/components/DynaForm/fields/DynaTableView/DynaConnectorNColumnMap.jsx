import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useMemo } from 'react';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import DynaTableView from './DynaTable';

export default function DynaConnectorNColumnMap(props) {
  const { optionsMap, id, _integrationId } = props;
  const dispatch = useDispatch();
  const { isLoading, shouldReset, data: metadata, fieldType } = useSelector(
    state =>
      selectors.connectorMetadata(state, id, null, _integrationId, optionsMap)
  );
  const handleRefreshClick = useCallback(
    fieldId => {
      dispatch(actions.connectors.refreshMetadata(fieldId, id, _integrationId));
    },
    [_integrationId, dispatch, id]
  );

  // console.log('render: <DynaConnectorNColumnMap>');
  const isLoadingMap = useMemo(() => ({[fieldType]: isLoading}), [fieldType, isLoading]);

  return (
    <DynaTableView
      {...props}
      collapsable
      isLoading={isLoadingMap}
      shouldReset={shouldReset}
      metadata={metadata}
      handleRefreshClickHandler={handleRefreshClick}
    />
  );
}
