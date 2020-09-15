import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import SQLQueryBuilderWrapper from '../../components/DynaForm/fields/DynaSQLQueryBuilder/SQLQueryBuilderWrapper';
import { selectors } from '../../reducers';

const SQLQueryBuilder = props => {
  const {flowId, importId, disabled} = props;
  const history = useHistory();
  const match = useRouteMatch();

  const id = 'rdbmsquery';
  const {modelMetadata, queryType, value, lookups} = useSelector(state => {
    const importResource = selectors.resource(state, 'imports', importId);
    const {query, queryType, lookups} = importResource.rdbms;
    const { modelMetadata } = importResource;

    return {queryType, modelMetadata, value: query, lookups};
  }, shallowEqual);

  const handleSave = (id, val) => {
    console.log('save', id, val);
    // onClose();
  };

  const lookupObj = {
    fieldId: 'rdbms.lookups',
    data: lookups,
  };

  useEffect(() => {
    history.replace(`${match.url}/${id}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SQLQueryBuilderWrapper
      id={id}
      onFieldChange={handleSave}
      options={{
        lookups: lookupObj,
        modelMetadata,
        modelMetadataFieldId: 'modelMetadata',
        queryType,
        // TODO
        // method,
      }}
      disabled={disabled}
      value={value}
      title="test"
      ruleTitle="Test"
      arrayIndex={0}
      resourceId={importId}
      flowId={flowId}
      resourceType="imports"
    // todo: remove
      hideDefaultData
    />
  );
};
export default function DatabaseMapping({integrationId}) {
  const match = useRouteMatch();
  const { flowId, importId, subRecordMappingId } = match.params;
  const isDatabaseImport = useSelector(state => {
    const importResource = selectors.resource(state, 'imports', importId);

    return !!['RDBMSImport', 'DynamodbImport'].includes(importResource.adaptorType);
  });

  const isMonitorLevelUser = useSelector(state => selectors.isFormAMonitorLevelAccess(state, integrationId));

  if (!isDatabaseImport) {
    return null;
  }

  return (
    <SQLQueryBuilder
      flowId={flowId}
      importId={importId}
      subRecordMappingId={subRecordMappingId}
      disabled={isMonitorLevelUser}
        />
  );
}
