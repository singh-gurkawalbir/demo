import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import SQLQueryBuilderWrapper from '../../../components/DynaForm/fields/DynaSQLQueryBuilder/SQLQueryBuilderWrapper';
import { selectors } from '../../../reducers';

const emptySet = {};
const SQLQueryBuilder = props => {
  const {flowId, importId, index, disabled} = props;
  const history = useHistory();
  const match = useRouteMatch();

  const id = 'rdbmsQuery';
  const {value, ...options} = useSelector(state => {
    const importResource = selectors.resource(state, 'imports', importId);

    if (importResource.adaptorType !== 'RDBMSImport') {
      return emptySet;
    }

    return {
      lookupFieldId: 'rdbms.lookups',
      queryTypeField: 'rdbms.queryType',
      modelMetadataFieldId: 'modelMetadata',
      lookups: importResource.rdbms?.lookups,
      queryType: importResource.rdbms?.queryType,
      modelMetadata: importResource?.modelMetadata,
      value: importResource.rdbms?.query,
      hideDefaultData: false,
    };
  }, shallowEqual);

  const [lookups, setLookups] = useState(options.lookups || []);
  const handleLookupUpdate = useCallback((_id, val) => {
    if (_id === options.lookupFieldId) {
      setLookups(val);
    }
  }, [options.lookupFieldId]);

  const optionalSaveParams = useMemo(() => ({
    processorKey: 'databaseMapping',
    resourceId: importId,
    resourceType: 'imports',
    queryIndex: index,
    query: value,
  }),
  [importId, index, value]
  );

  useEffect(() => {
    history.replace(`${match.url}/${id}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SQLQueryBuilderWrapper
      id={id}
      onFieldChange={handleLookupUpdate}
      disabled={disabled}
      value={value}
      title="SQL Query Builder"
      ruleTitle="Template"
      arrayIndex={index}
      resourceId={importId}
      flowId={flowId}
      resourceType="imports"
      {...options}
      lookups={lookups}
      optionalSaveParams={optionalSaveParams}
      patchOnSave

    />
  );
};

export default function DatabaseMapping({integrationId}) {
  const match = useRouteMatch();
  const { flowId, importId, index } = match.params;
  const isDatabaseImport = useSelector(state => {
    const importResource = selectors.resource(state, 'imports', importId);

    return !!['RDBMSImport', 'DynamodbImport', 'MongodbImport'].includes(importResource.adaptorType);
  });

  const isMonitorLevelUser = useSelector(state => selectors.isFormAMonitorLevelAccess(state, integrationId));

  if (!isDatabaseImport) {
    return null;
  }

  return (
    <SQLQueryBuilder
      flowId={flowId}
      importId={importId}
      disabled={isMonitorLevelUser}
      index={index}
    />
  );
}
