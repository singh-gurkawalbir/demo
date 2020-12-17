import React, { useCallback } from 'react';
import DynaConnectoroNColumnMap from './DynaConnectorNColumnMap';
import DynaStaticMap from './DynaStaticMap';
import DynaTableView from './DynaTable';
import DynaStaticMapWidget from './DynaStaticMapWidget';
import LoadResources from '../../../LoadResources';
import DynaRefreshableStaticMap from './DynaRefreshableStaticMap';

export default function DynaTable(props) {
  const {
    connectionId,
    optionsMap,
    map,
    _integrationId,
    extractFieldHeader,
    extracts,
    onFieldChange,
    value,
    keyResource,
    valueResource,
  } = props;
  let tableType;
  // The values should be saved within a value object
  const updatedOnFieldChange = useCallback(
    (id, value) => {
      onFieldChange(id, { value });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  // this is done to account for the above value save behavior
  const updatedValue = (value && value.value) || value;
  const updatedProps = {
    ...props,
    value: updatedValue,
    onFieldChange: updatedOnFieldChange,
  };

  if (extractFieldHeader || extracts) {
    tableType = 'staticMapWidget';
  } else if (connectionId || keyResource || valueResource) {
    tableType = 'refreshableStaticMap';
  } else if ((map || !optionsMap) && !connectionId) {
    tableType = 'staticMap';
  } else if (optionsMap?.length && _integrationId) {
    tableType = 'connectorStaticMap';
  } else {
    tableType = 'generic';
  }

  return (
    <LoadResources required resources="connections">
      {tableType === 'connectorStaticMap' && (
        <DynaConnectoroNColumnMap {...updatedProps} />
      )}
      {tableType === 'refreshableStaticMap' && (
        <DynaRefreshableStaticMap {...props} />
      )}
      {tableType === 'staticMap' && <DynaStaticMap {...props} />}
      {tableType === 'staticMapWidget' && <DynaStaticMapWidget {...props} />}
      {tableType === 'generic' && <DynaTableView {...updatedProps} />}
    </LoadResources>
  );
}
