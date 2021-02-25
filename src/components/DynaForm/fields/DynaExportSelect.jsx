import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { DynaGenericSelect } from './DynaRefreshableSelect/RefreshGenericResource';
import { makeExportResource } from '../../../utils/exportData';

export default function DynaExportSelect(props) {
  const { resourceContext, resource, id, type } = props;
  const resourceType = resourceContext?.resourceType;
  const resourceId = resourceContext?.resourceId;
  const { _connectionId: resConnectionId, _connectorId: resConnectorId } = useSelector(state => (selectors.resource(state, resourceType, resourceId) || {}));
  const { kind, key, exportResource } = makeExportResource(resource, resConnectionId, resConnectorId);
  const { status, data, errorMessage } = useSelector(state =>
    selectors.exportData(state, key)
  );
  const dispatch = useDispatch();
  const onFetch = useCallback(() => {
    dispatch(actions.exportData.request(kind, key, exportResource));
  }, [dispatch, kind, key, exportResource]);

  if (!kind || !key || !exportResource) {
    return (
      <>
        <Typography>{`Field id=${id}, type=${type}`}</Typography>
        <Typography>requires export resource.</Typography>
      </>
    );
  }

  return (
    <DynaGenericSelect
      resourceToFetch={key}
      onFetch={onFetch}
      onRefresh={onFetch}
      fieldStatus={status}
      fieldData={data}
      fieldError={errorMessage}
      {...props}
    />
  );
}
