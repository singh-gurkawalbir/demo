import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { DynaGenericSelect } from './DynaRefreshableSelect/RefreshGenericResource';
import { makeExportResource } from '../../../utils/exportData';

export default function DynaExportSelect(props) {
  const { resourceContext, resource, id, type } = props;
  const resourceContextType = resourceContext?.resourceType;
  const resourceContextId = resourceContext?.resourceId;
  const { _connectionId: resConnectionId, _connectorId: resConnectorId } = useSelector(state => (selectors.resource(state, resourceContextType, resourceContextId) || {}));
  const { kind, identifier, exportResource } = makeExportResource(resource, resConnectionId, resConnectorId);
  const { status, data, errorMessage } = useSelector(state =>
    selectors.exportData(state, identifier)
  );
  const dispatch = useDispatch();
  const onFetch = useCallback(() => {
    dispatch(actions.exportData.request(kind, identifier, exportResource));
  }, [dispatch, kind, identifier, exportResource]);

  if (!kind || !identifier || !exportResource) {
    return (
      <>
        <Typography>{`Field id=${id}, type=${type}`}</Typography>
        <Typography>requires export resource.</Typography>
      </>
    );
  }

  return (
    <DynaGenericSelect
      resourceToFetch={identifier}
      onFetch={onFetch}
      onRefresh={onFetch}
      fieldStatus={status}
      fieldData={data}
      fieldError={errorMessage}
      {...props}
    />
  );
}
