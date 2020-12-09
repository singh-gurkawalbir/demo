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
export const KBDocumentation = {'3dcart': 'https://docs.celigo.com/hc/en-us/sections/360007385152-3dCart',
  netsuite: 'https://docs.celigo.com/hc/en-us/sections/360007478471-NetSuite',
  zendesk: 'https://docs.celigo.com/hc/en-us/sections/360007387992-Zendesk',
  '3plcentral': 'https://docs.celigo.com/hc/en-us/sections/360008434132-3PL-Central',
  '4castplus': 'https://docs.celigo.com/hc/en-us/sections/360008103851-4castplus',
  accelo: 'https://docs.celigo.com/hc/en-us/sections/360007476291-Accelo',
  ftp: 'https://docs.celigo.com/hc/en-us/sections/360007479691-FTP'};

