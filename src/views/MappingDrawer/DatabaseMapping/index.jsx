import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import SQLQueryBuilderWrapper from '../../../components/DynaForm/fields/DynaSQLQueryBuilder/SQLQueryBuilderWrapper';
import { selectors } from '../../../reducers';

const emptySet = {};
const SQLQueryBuilder = props => {
  const {flowId, importId, index, disabled} = props;
  const history = useHistory();
  const match = useRouteMatch();

  const id = 'rdbmsQuery';
  const importResource = useSelector(state => selectors.resource(state, 'imports', importId));
  const {value, title, ruleTitle, ...options} = useMemo(() => {
    if (importResource.adaptorType === 'RDBMSImport') {
      return {
        lookups: importResource.rdbms.lookups,
        queryType: importResource.rdbms.queryType,
        modelMetadata: importResource.modelMetadata,
        value: importResource.rdbms.query,
        hideDefaultData: false,
      };
    }
    if (importResource.adaptorType === 'MongodbImport') {
      return {
        method: importResource.mongodb.method,
        value: importResource.mongodb.method === 'insertMany' ? importResource.mongodb.document : importResource.mongodb.update,
        hideDefaultData: true,
      };
    }
    if (importResource.adaptorType === 'DynamodbImport') {
      return {
        method: importResource.dynamodb.method,
        value: importResource.dynamodb.method === 'putItem' && importResource.dynamodb.itemDocument,
        hideDefaultData: true,
      };
    }

    return emptySet;
  }, [importResource]);

  const [lookups, setLookups] = useState(options.lookups || []);
  const handleLookupUpdate = useCallback((_id, val) => {
    if (_id === options.lookupFieldId) {
      setLookups(val);
    }
  }, [options.lookupFieldId]);

  const optionalSaveParams = useMemo(() => {
    const opts = {};

    if (importResource.adaptorType === 'MongodbImport') {
      opts.method = importResource.mongodb.method;
    } else if (importResource.adaptorType === 'DynamodbImport') {
      opts.method = importResource.dynamodb.method;
    }

    return {
      processorKey: 'databaseMapping',
      resourceId: importId,
      resourceType: 'imports',
      adaptorType: importResource.adaptorType,
      queryIndex: index,
      query: value,
      ...opts,
    };
  },
  [importId, importResource, index, value]
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
      title={title}
      ruleTitle={ruleTitle}
      querySetPos={index}
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
