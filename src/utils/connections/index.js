import { matchPath } from 'react-router-dom';
import { RDBMS_TYPES } from '../constants';

export const getReplaceConnectionExpression = (connection, isFrameWork2, childId, integrationId, connectorId, hideOwnConnection) => {
  let options = {};
  const expression = [];
  const integratorExpression = [];
  const { _id, type, assistant } = connection || {};

  if (hideOwnConnection) { expression.push({ _id: {$ne: _id} }); }

  if (RDBMS_TYPES.includes(type)) {
    expression.push({ 'rdbms.type': type });
  } else if (type === 'rest' || (type === 'http' && connection?.http?.formType === 'rest')) {
    expression.push({ $or: [{ 'http.formType': 'rest' }, { type: 'rest' }] });
  } else if (type === 'http') {
    expression.push({ 'http.formType': { $ne: 'rest' } });
    expression.push({ type });
  } else {
    expression.push({ type });
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

  if (assistant) {
    expression.push({ assistant });

    const andingExpressions = { $and: expression };

    options = { filter: andingExpressions, appType: assistant };
  } else {
    const andingExpressions = { $and: expression };

    options = { filter: andingExpressions, appType: type };
  }

  return options;
};
export const KBDocumentation = {
  http: 'https://docs.celigo.com/hc/en-us/sections/360007388192-HTTP-',
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
  salesforce: 'https://docs.celigo.com/hc/en-us/sections/360007478991-Salesforce-',
};

export const amazonSellerCentralAuthURI = {
  A2EUQ1WTGCTBG2: 'https://sellercentral.amazon.ca/apps/authorize/consent',
  ATVPDKIKX0DER: 'https://sellercentral.amazon.com/apps/authorize/consent',
  A1AM78C64UM0Y8: 'https://sellercentral.amazon.com.mx/apps/authorize/consent',
  A2Q3Y263D00KWC: 'https://sellercentral.amazon.com.br/apps/authorize/consent',
  A1RKKUPIHCS9HS: 'https://sellercentral-europe.amazon.com/apps/authorize/consent',
  A1F83G8C2ARO7P: 'https://sellercentral-europe.amazon.com/apps/authorize/consent',
  A13V1IB3VIYZZH: 'https://sellercentral-europe.amazon.com/apps/authorize/consent',
  A1805IZSGTT6HS: 'https://sellercentral.amazon.nl/apps/authorize/consent',
  A1PA6795UKMFR9: 'https://sellercentral-europe.amazon.com/apps/authorize/consent',
  APJ6JRA9NG5V4: 'https://sellercentral-europe.amazon.com/apps/authorize/consent',
  A2NODRKZP88ZB9: 'https://sellercentral.amazon.se/apps/authorize/consent',
  A1C3SOZRARQ6R3: 'https://sellercentral.amazon.pl/apps/authorize/consent',
  A33AVAJ2PDY3EV: 'https://sellercentral.amazon.com.tr/apps/authorize/consent',
  A2VIGQ35RCS4UG: 'https://sellercentral.amazon.ae/apps/authorize/consent',
  A21TJRUUN4KGV: 'https://sellercentral.amazon.in/apps/authorize/consent',
  A19VAU5U5O7RUS: 'https://sellercentral.amazon.sg/apps/authorize/consent',
  A39IBJ37TRP1C6: 'https://sellercentral.amazon.com.au/apps/authorize/consent',
  A1VC38T7YXB528: 'https://sellercentral.amazon.co.jp/apps/authorize/consent',
};

export const amazonSellerCentralMarketPlaceOptions = {
  northAmerica: [
    {label: 'Canada', value: 'A2EUQ1WTGCTBG2' },
    {label: 'United States of America', value: 'ATVPDKIKX0DER' },
    {label: 'Mexico', value: 'A1AM78C64UM0Y8' },
    {label: 'Brazil', value: 'A2Q3Y263D00KWC' },
  ],
  europe: [
    {label: 'Spain', value: 'A1RKKUPIHCS9HS'},
    {label: 'United Kingdom', value: 'A1F83G8C2ARO7P'},
    {label: 'France', value: 'A13V1IB3VIYZZH'},
    {label: 'Netherlands', value: 'A1805IZSGTT6HS'},
    {label: 'Germany', value: 'A1PA6795UKMFR9'},
    {label: 'Italy', value: 'APJ6JRA9NG5V4'},
    {label: 'Sweden', value: 'A2NODRKZP88ZB9'},
    {label: 'Poland', value: 'A1C3SOZRARQ6R3'},
    {label: 'Turkey', value: 'A33AVAJ2PDY3EV'},
    {label: 'United Arab Emirates', value: 'A2VIGQ35RCS4UG'},
    {label: 'India', value: 'A21TJRUUN4KGV'},
  ],
  farEast: [
    {label: 'Singapore', value: 'A19VAU5U5O7RUS'},
    {label: 'Australia', value: 'A39IBJ37TRP1C6'},
    {label: 'Japan', value: 'A1VC38T7YXB528'},
  ],
};

export const amazonSellerCentralBaseUriForNonMWSConnection = {
  northAmerica: 'https://sellingpartnerapi-na.amazon.com/',
  europe: 'https://sellingpartnerapi-eu.amazon.com/',
  farEast: 'https://sellingpartnerapi-fe.amazon.com',
};

export const amazonSellerCentralBaseUriForMWSConnection = {
  north_america: 'https://mws.amazonservices.com',
  europe: 'https://mws-eu.amazonservices.com',
  india: 'https://mws.amazonservices.in',
  china: 'https://mws.amazonservices.com.cn',
  japan: 'https://mws.amazonservices.jp',
  australia: 'https://mws.amazonservices.com.au',
};

// given a url, this util returns the path params
// to identify the parent export/import type and id
// This is used when a connection is opened inside a resource
export const getParentResourceContext = url => {
  if (!url) return {};
  const RESOURCE_DRAWER_PATH = '/:operation(add|edit)/:parentType/:parentId';
  const CONN_DRAWER_PATH = '/:operation(add|edit)/connections/:connId';

  return matchPath(url, {
    path: `/**${RESOURCE_DRAWER_PATH}${CONN_DRAWER_PATH}`,
    exact: true})?.params || {};
};
