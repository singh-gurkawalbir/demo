import React, { useCallback, useMemo } from 'react';
import DynaConnectoroNColumnMap from './DynaConnectorNColumnMap';
import DynaStaticMap from './DynaStaticMap';
import DynaTableView from './DynaTable';
import DynaStaticMapWidget from './DynaStaticMapWidget';
import LoadResources from '../../../LoadResources';
import DynaRefreshableStaticMap from './DynaRefreshableStaticMap';
import FieldMessage from '../FieldMessage';

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

  const propsWithVirtualization = useMemo(() => ({...props, isVirtualizedTable: true}), [props]);
  // this is done to account for the above value save behavior

  const updatedProps = useMemo(() => ({
    ...propsWithVirtualization,
    value: (value && value.value) || value,
    onFieldChange: updatedOnFieldChange,
  }), [propsWithVirtualization, updatedOnFieldChange, value]);

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
        <DynaRefreshableStaticMap {...propsWithVirtualization} />
      )}
      {tableType === 'staticMap' && <DynaStaticMap {...propsWithVirtualization} />}
      {tableType === 'staticMapWidget' && <DynaStaticMapWidget {...propsWithVirtualization} />}
      {/* We are adding the invalidateParentFieldOnError property inorder to fix the allignment issue which is causing by Asterisk
          when we are using the type as exportSelect in the custom settings form builder */}
      {tableType === 'generic' && <DynaTableView {...updatedProps} invalidateParentFieldOnError />}
      <FieldMessage {...props} />
    </LoadResources>
  );
}
