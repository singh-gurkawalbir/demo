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

