import { RDBMS_TYPES } from '../constants';

export const getReplaceConnectionExpression = (connection, isFrameWork2, childId, integrationId, connectorId, hideOwnConnection) => {
  let options = {};
  const expression = [];
  const integratorExpression = [];

  if (hideOwnConnection) { expression.push({ _id: {$ne: connection._id} }); }

  if (RDBMS_TYPES.includes(connection.type)) {
    expression.push({ 'rdbms.type': connection.type });
  } else {
    expression.push({ type: connection.type });
  }

  if (connectorId) {
    expression.push({ _connectorId: connectorId});
    if (isFrameWork2 && childId) {
      integratorExpression.push({ _integrationId: integrationId});
      integratorExpression.push({ _integrationId: childId});
      expression.push({ $or: integratorExpression });
    } else { expression.push({ _integrationId: integrationId}); }
  } else {
    expression.push({ _connectorId: { $exists: false } });
  }

  if (connection.assistant) {
    expression.push({ assistant: connection.assistant });

    const andingExpressions = { $and: expression };

    options = { filter: andingExpressions, appType: connection.assistant };
  } else {
    const andingExpressions = { $and: expression };

    options = { filter: andingExpressions, appType: connection.type };
  }

  return options;
};
export const KBDocumentation = {http: 'https://docs.celigo.com/hc/en-us/sections/360007388192-HTTP-',
  rest: 'https://docs.celigo.com/hc/en-us/sections/360007479711-REST',
  ftp: 'https://docs.celigo.com/hc/en-us/articles/360045263152-Set-up-an-FTP-connection-',
  as2: 'https://docs.celigo.com/hc/en-us/articles/360029551372-Set-up-an-AS2-connection',
  mongodb: 'https://docs.celigo.com/hc/en-us/articles/360039632032-Set-up-a-connection-to-MongoDB',
  mysql: 'https://docs.celigo.com/hc/en-us/articles/360038611852-Set-up-a-connection-to-MySQL',
  oracle: 'https://docs.celigo.com/hc/en-us/articles/360050360312-Set-up-a-connection-to-Oracle-DB-SQL-',
  postgresql: 'https://docs.celigo.com/hc/en-us/articles/360038997991-Set-up-a-connection-to-PostgreSQL',
  snowflake: 'https://docs.celigo.com/hc/en-us/articles/360048048792-Set-up-a-connection-to-Snowflake',
  dynamodb: 'https://docs.celigo.com/hc/en-us/articles/360039720112-Set-up-a-connection-to-DynamoDB',
  netsuite: 'https://docs.celigo.com/hc/en-us/articles/360038996151-Set-up-a-connection-to-NetSuite',
  s3: 'https://docs.celigo.com/hc/en-us/articles/360038373912-Set-up-a-connection-to-Amazon-S3',
  salesforce: 'https://docs.celigo.com/hc/en-us/sections/360007478991-Salesforce-'};

