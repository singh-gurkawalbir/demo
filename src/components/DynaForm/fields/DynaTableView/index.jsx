import React, { useCallback, useMemo } from 'react';
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
    [onFieldChange]
  );
  // this is done to account for the above value save behavior

  const updatedProps = useMemo(() => ({
    ...props,
    value: (value && value.value) || value,
    onFieldChange: updatedOnFieldChange,
  }), [props, updatedOnFieldChange, value]);

  if (extractFieldHeader || extracts) {
    tableType = 'staticMapWidget';
  } else if ((map || !optionsMap) && !connectionId && !keyResource && !valueResource) {
    tableType = 'staticMap';
  } else if (optionsMap?.length && _integrationId && !keyResource && !valueResource) {
    tableType = 'connectorStaticMap';
  } else if (connectionId || keyResource || valueResource) {
    tableType = 'refreshableStaticMap';
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
