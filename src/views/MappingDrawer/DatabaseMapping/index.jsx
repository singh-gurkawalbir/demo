import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import SQLQueryBuilderWrapper from '../../../components/DynaForm/fields/DynaSQLQueryBuilder/SQLQueryBuilderWrapper';
import { selectors } from '../../../reducers';

const getEditorTitle = adaptorType => {
  if (adaptorType === 'MongodbImport') {
    return 'MongoDB document builder';
  }
  if (adaptorType === 'DynamodbImport') {
    return 'DynamoDB query builder';
  }
  if (adaptorType === 'RDBMSImport') {
    return 'SQL query builder';
  }
};
const emptyObject = {};
const SQLQueryBuilder = props => {
  const {flowId, importId, index, disabled} = props;
  const importResource = useSelector(state => selectors.resource(state, 'imports', importId));
  const {value, ruleTitle, ...options} = useMemo(() => {
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

    return emptyObject;
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
  const label = getEditorTitle(importResource.adaptorType);

  return (
    <SQLQueryBuilderWrapper
    // id is empty to match url
      id=""
      onFieldChange={handleLookupUpdate}
      disabled={disabled}
      value={value}
      label={label}
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
    const importResource = selectors.resource(state, 'imports', importId) || emptyObject;

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
