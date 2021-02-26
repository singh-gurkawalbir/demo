/* eslint-disable camelcase */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, Redirect } from 'react-router-dom';
import { selectors } from '../../../reducers';
import { getValidRelativePath } from '../../../utils/routePaths';
import actions from '../../../actions';

const emptyObject = {};

export default function DatabaseMapping_afe2() {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const { flowId, importId, index } = match.params;
  const importResource = useSelector(state => selectors.resource(state, 'imports', importId) || emptyObject);

  const isDatabaseImport = !!['RDBMSImport', 'DynamodbImport', 'MongodbImport'].includes(importResource.adaptorType);

  let fieldId = '';

  if (importResource.adaptorType === 'RDBMSImport') {
    fieldId = 'rdbms.query';
  } else if (importResource.adaptorType === 'MongodbImport') {
    fieldId = importResource.mongodb.method === 'insertMany' ? 'mongodb.document' : 'mongodb.update';
  } else if (importResource.adaptorType === 'DynamodbImport') {
    fieldId = importResource.dynamodb.method === 'putItem' && 'dynamodb.itemDocument';
  }
  const editorId = getValidRelativePath(fieldId);

  useEffect(() => {
    dispatch(actions._editor.init(editorId, 'databaseMapping', {
      flowId,
      fieldId,
      resourceId: importId,
      resourceType: 'imports',
      stage: 'flowInput',
      arrayIndex: index && parseInt(index, 10),
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isDatabaseImport) {
    return null;
  }

  return (
    <Redirect to={`${match.url}/editor/${editorId}`} />
  );
}
