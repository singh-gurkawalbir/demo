import { useSelector } from 'react-redux';
import DynaConnectoroNColumnMap from './DynaConnectorNColumnMap';
import DynaStaticMap from './DynaStaticMap';
import DynaTableView from './DynaTable';
import DynaStaticMapWidget from './DynaStaticMapWidget';
import LoadResources from '../../../../components/LoadResources';
import * as selectors from '../../../../reducers';
import DynaRefreshableStaticMap from './DynaRefreshableStaticMap';

export default function DynaTable(props) {
  const {
    connectionId,
    optionsMap,
    map,
    _integrationId,
    extractFieldHeader,
    extracts,
  } = props;
  let tableType;
  let connection;

  useSelector(state => {
    if (connectionId) {
      connection = selectors.resource(state, 'connections', connectionId);
    }
  });

  if (extractFieldHeader || extracts) {
    tableType = 'staticMapWidget';
  } else if ((map || !optionsMap) && !connectionId) {
    tableType = 'staticMap';
  } else if (optionsMap && optionsMap.length && _integrationId) {
    tableType = 'connectorStaticMap';
  } else if (connectionId && connection) {
    tableType = 'refreshableStaticMap';
  } else {
    tableType = 'generic';
  }

  return (
    <LoadResources required resources="connections">
      {tableType === 'connectorStaticMap' && (
        <DynaConnectoroNColumnMap {...props} />
      )}
      {tableType === 'refreshableStaticMap' && (
        <DynaRefreshableStaticMap {...props} />
      )}
      {tableType === 'staticMap' && <DynaStaticMap {...props} />}
      {tableType === 'staticMapWidget' && <DynaStaticMapWidget {...props} />}
      {tableType === 'generic' && <DynaTableView collapsable {...props} />}
    </LoadResources>
  );
}
