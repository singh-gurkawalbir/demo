import React, { useCallback, useEffect, useState } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { isEqual } from 'date-fns';
import SQLQueryBuilderWrapper from '../../../components/DynaForm/fields/DynaSQLQueryBuilder/SQLQueryBuilderWrapper';
import { selectors } from '../../../reducers';
import { SCOPES } from '../../../sagas/resourceForm';
import actions from '../../../actions';

const emptySet = {};
const SQLQueryBuilder = props => {
  const {flowId, importId, index, disabled} = props;
  const dispatch = useDispatch();
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

  const [lookups, setLookups] = useState(options.lookups);
  const [modelMetadata, setModelMetadata] = useState(options.modelMetadata);
  const handleSave = useCallback((_id, val) => {
    if (_id === options.lookupFieldId) {
      setLookups(val);
    }
    if (_id === options.modelMetadataFieldId) {
      setModelMetadata(val);
    } else {
      const patchSet = [{
        op: 'replace',
        path: '/rdbms/query',
        value: val,
      }];

      if (isEqual(options.lookups, lookups)) {
        patchSet.push({
          op: 'replace',
          path: '/rdbms/lookups',
          value: lookups,
        });
      }
      if (isEqual(options.modelMetadata, modelMetadata)) {
        patchSet.push({
          op: 'replace',
          path: '/modelMetadata',
          value: modelMetadata,
        });
      }
      dispatch(
        actions.resource.patchStaged(importId, patchSet, SCOPES.VALUE)
      );
      dispatch(actions.resource.commitStaged('imports', importId, 'value'));
    }
  }, [dispatch, importId, lookups, modelMetadata, options.lookupFieldId, options.lookups, options.modelMetadata, options.modelMetadataFieldId]);

  useEffect(() => {
    history.replace(`${match.url}/${id}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SQLQueryBuilderWrapper
      id={id}
      onFieldChange={handleSave}
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
      modelMetadata={modelMetadata}

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
  console.log('index', index);

  return (
    <SQLQueryBuilder
      flowId={flowId}
      importId={importId}
      disabled={isMonitorLevelUser}
      index={index}
    />
  );
}
