/* eslint-disable import/no-duplicates */
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import DynaNetSuiteLookup from './DynaNetSuiteLookup';
// TODO: change the references to point to correct filters
import DynaSFLookup from './DynaNetSuiteLookup';
import DynaNSQualifier from './DynaNetSuiteLookup';
import DynaSFQualifier from './DynaNetSuiteLookup';

export default function DynaIANetSuiteLookup(props) {
  const { resource: flow, properties = {}, type } = props;
  let resourceId;
  let commMetaPath;
  let filterType;
  let ExpressionBuilder;

  if (properties._importId) {
    resourceId = properties._importId;
  } else if (flow._importId) {
    resourceId = flow._importId;
  } else if (flow.pageProcessors) {
    const firstImportPageProcessor = flow.pageProcessors.find(
      pp => !!pp._importId
    );

    resourceId = firstImportPageProcessor._importId;
  }

  const resource = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', resource._connectionId)
  );

  if (type === 'import') {
    if (connection.type === 'netsuite') {
      filterType = 'netsuiteImportLookup';
      commMetaPath = `netsuite/metadata/suitescript/connections/${connection._id}/recordTypes/${resource.netsuite_da.recordType}/searchFilters?includeJoinFilters=true`;
    } else if (connection.type === 'salesforce') {
      filterType = 'salesforceImportLookup';
      commMetaPath = `salesforce/metadata/connections/${connection._id}/sObjectTypes/${resource.salesforce.sObjectType}`;
    }
  } else if (type === 'export') {
    if (connection.type === 'salesforce') {
      filterType = 'salesforceQualifier';
      commMetaPath = `salesforce/metadata/connections/${connection._id}/sObjectTypes/${resource.salesforce.sObjectType}`;
    } else {
      filterType = 'netsuiteQualifier';
      commMetaPath = `netsuite/metadata/suitescript/connections/${connection._id}/recordTypes/${resource.netsuite_da.recordType}/searchFilters?includeJoinFilters=true`;
    }
  }

  const options = { commMetaPath, disableFetch: false };

  switch (filterType) {
    case 'netsuiteImportLookup':
      ExpressionBuilder = DynaNetSuiteLookup;
      break;
    case 'salesforceImportLookup':
      ExpressionBuilder = DynaSFLookup;
      break;
    case 'netsuiteQualifier':
      ExpressionBuilder = DynaNSQualifier;
      break;
    case 'salesforceQualifier':
      ExpressionBuilder = DynaSFQualifier;
      break;
    default:
      ExpressionBuilder = DynaNetSuiteLookup;
      break;
  }

  return (
    <ExpressionBuilder
      {...props}
      flowId={resource._id}
      options={options}
      resourceId={resourceId}
    />
  );
}
