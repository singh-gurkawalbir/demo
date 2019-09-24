import { useSelector } from 'react-redux';
import DynaConnectoroNColumnMap from './DynaConnectorNColumnMap';
import DynaNSStaticMap from './DynaNSStaticMap';
import DynaSFStaticMap from './DynaSFStaticMap';
import DynaStaticMap from './DynaStaticMap';
import DynaTableView from './DynaTable';
import LoadResources from '../../../../components/LoadResources';
import * as selectors from '../../../../reducers';

export default function DynaTable(props) {
  const { connectionId, optionsMap, map, _integrationId, id } = props;
  let tableType;
  let connection;

  useSelector(state => {
    if (connectionId) {
      connection = selectors.resource(state, 'connections', connectionId);
    }
  });

  if ((map || !optionsMap) && !connectionId) {
    tableType = 'staticMap';
  } else if (optionsMap && optionsMap.length && _integrationId) {
    tableType = 'connectorStaticMap';
  } else if (connectionId && connection) {
    if (connection.type === 'netsuite') {
      tableType = 'nsStaticMap';
    } else {
      tableType = 'sfStaticMap';
    }
  } else {
    tableType = 'generic';
  }

  return (
    <LoadResources data-test={id} required resources="connections">
      {tableType === 'connectorStaticMap' && (
        <DynaConnectoroNColumnMap {...props} />
      )}
      {tableType === 'nsStaticMap' && <DynaNSStaticMap {...props} />}
      {tableType === 'sfStaticMap' && <DynaSFStaticMap {...props} />}
      {tableType === 'staticMap' && <DynaStaticMap {...props} />}
      {tableType === 'generic' && <DynaTableView {...props} />}
    </LoadResources>
  );
}
