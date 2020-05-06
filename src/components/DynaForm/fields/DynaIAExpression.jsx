/* eslint-disable import/no-duplicates */
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useResourceList from '../../../hooks/useResourceList';
import * as selectors from '../../../reducers';
import DynaNetSuiteLookup from './DynaNetSuiteLookup';
import DynaNSQualifier from './DynaNetSuiteQualifier';
import DynaSFLookup from './DynaSalesforceLookup';
import DynaSFQualifier from './DynaSalesforceQualifier';

export default function DynaIAExpression(props) {
  const {
    flowId,
    properties = {},
    expressionType: type,
    recordType,
    _integrationId,
  } = props;
  let resourceId;
  let commMetaPath;
  let filterType;
  let ExpressionBuilder;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));

  if (type === 'import') {
    if (properties._importId) {
      resourceId = properties._importId;
    } else if (flow && flow._importId) {
      resourceId = flow._importId;
    } else if (flow && flow.pageProcessors) {
      const firstImportPageProcessor = flow.pageProcessors.find(
        pp => !!pp._importId
      );

      resourceId = firstImportPageProcessor._importId;
    }
  } else if (type === 'export') {
    if (properties._exportId) {
      resourceId = properties._exportId;
    } else if (flow && flow._exportId) {
      resourceId = flow._exportId;
    } else if (flow && flow.pageGenerators && flow.pageGenerators.length) {
      resourceId = flow.pageGenerators[0]._exportId;
    }
  }

  const resource = useSelector(state =>
    selectors.resource(
      state,
      type === 'export' ? 'exports' : 'imports',
      resourceId
    )
  );
  const filterConfig = useMemo(
    () => ({
      type: 'connections',
      filter: { type: 'netsuite', _integrationId },
    }),
    [_integrationId]
  );
  const connectionRecordType = useResourceList(filterConfig).resources[0];
  const connectionOrig = useSelector(state =>
    selectors.resource(state, 'connections', resource && resource._connectionId)
  );
  const connection = useMemo(() => {
    if (resource) return connectionOrig;
    else if (recordType) return connectionRecordType;
  }, [connectionOrig, connectionRecordType, recordType, resource]);

  if (!connection) {
    return null;
  }

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
      commMetaPath = `netsuite/metadata/suitescript/connections/${connection._id}/recordTypes/${resource.netsuite.distributed.recordType}?includeSelectOptions=true`;
    }
  } else if (recordType) {
    filterType = 'netsuiteImportLookup';
    commMetaPath = `netsuite/metadata/suitescript/connections/${connection._id}/recordTypes/${recordType}/searchFilters?includeJoinFilters=true`;
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
      flowId={flowId}
      options={options}
      resourceId={resource && resource._id}
    />
  );
}
