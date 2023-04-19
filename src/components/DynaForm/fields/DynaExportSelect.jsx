import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@mui/material';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import { DynaGenericSelect } from './DynaRefreshableSelect/RefreshGenericResource';
import { makeExportResource } from '../../../utils/exportData';
import useIntegration from '../../../hooks/useIntegration';
import useResourceSettingsContext from '../../../hooks/useResourceSettingsContext';

export default function DynaExportSelect(props) {
  const { resourceContext, resource, id, type, devPlayGroundSpecificField } = props;
  const resourceType = resourceContext?.resourceType;
  const resourceId = resourceContext?.resourceId;
  const integrationId = useIntegration(resourceType, resourceId);
  const resContext = useResourceSettingsContext(resourceType, resourceId, integrationId);
  const { _connectionId: resConnectionId, _connectorId: resConnectorId } = useSelector(state => (selectors.resource(state, resourceType, resourceId) || {}));
  const { kind, key, exportResource } = makeExportResource(resource, resConnectionId, resConnectorId);
  const { status, data, error: errorMessage } = useSelector(state =>
    selectors.exportData(state, key)
  );
  const dispatch = useDispatch();
  const onFetch = useCallback(() => {
    if (!devPlayGroundSpecificField) { dispatch(actions.exportData.request({kind, identifier: key, resource: exportResource, resourceContext: resContext})); }
  }, [devPlayGroundSpecificField, dispatch, kind, key, exportResource, resContext]);

  if (!kind || !key || !exportResource) {
    return (
      <>
        <Typography>{`Field id=${id}, type=${type}`}</Typography>
        <Typography>requires export resource.</Typography>
      </>
    );
  }
  if (devPlayGroundSpecificField) {
    const tempData = [{id: '2', recordType: 'shipitem', label: 'Pick-up at store', value: '2'}, {id: '3', recordType: 'shipitem', label: 'Truck', value: '3'}, {id: '77', recordType: 'shipitem', label: 'UPS Next Day Air', value: '77'}];

    return (
      <DynaGenericSelect
        resourceToFetch={key}
        onFetch={onFetch}
        onRefresh={onFetch}
        fieldStatus="received"
        fieldData={tempData}
        {...props} />
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
