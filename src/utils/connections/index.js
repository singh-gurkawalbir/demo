import { matchPath } from 'react-router-dom';
import { PING_STATES } from '../../reducers/comms/ping';
import { CONSTANT_CONTACT_VERSIONS, EBAY_TYPES, emptyObject, MULTIPLE_AUTH_TYPE_ASSISTANTS, RDBMS_TYPES } from '../../constants';
import { rdbmsSubTypeToAppType } from '../resource';
import {getHttpConnector} from '../../constants/applications';
import { getConnectorId } from '../assistant';

export const getStatusVariantAndMessage = ({
  resourceType,
  showOfflineMsg,
  testStatus,
}) => {
  if (resourceType !== 'connections') {
    return { variant: 'warning' };
  }

  if (testStatus === PING_STATES.ERROR) {
    return {
      variant: 'error',
      message:
        'Your test was not successful. Check your information and try again',
    };
  } if (testStatus === PING_STATES.SUCCESS) {
    return {
      variant: 'success',
      message: 'Your connection is working great! Nice Job!',
    };
  } if (!testStatus && showOfflineMsg) {
    return {
      variant: 'error',
      message: 'This connection is currently offline. Re-enter your credentials to bring it back online.',
    };
  }

  return {};
};

export const getFilterExpressionForAssistant = (assistant, expression) => {
  if (!assistant ||
      typeof assistant !== 'string' ||
      !expression ||
      !Array.isArray(expression)) {
    return emptyObject;
  }

  if (assistant.includes('constantcontact')) {
    const resultExpression = { $or: [] };

    CONSTANT_CONTACT_VERSIONS.forEach(version => {
      const finalExpression = [...expression, {assistant: `constantcontact${version}`}];

      resultExpression.$or.push({$and: finalExpression});
    });

    return resultExpression;
  }
  if (assistant === 'ebay' || assistant === 'ebayfinance') {
    const resultExpression = { $or: [] };

    EBAY_TYPES.forEach(type => {
      const finalExpression = [...expression, {assistant: type}];

      resultExpression.$or.push({$and: finalExpression});
    });

    return resultExpression;
  }

  expression.push({assistant});

  return { $and: expression };
};

export const getReplaceConnectionExpression = (connection, isFrameWork2, childId, integrationId, connectorId, hideOwnConnection) => {
  let options = {};
  const expression = [];
  const integratorExpression = [];
  const { _id, type, assistant } = connection || {};

  if (hideOwnConnection) { expression.push({ _id: {$ne: _id} }); }
  if (type === 'jdbc' && RDBMS_TYPES.includes(connection?.jdbc?.type)) {
    // jdbc subtype is required to filter the connections
    expression.push({ 'jdbc.type': connection.jdbc.type });
  } else if (type === 'rdbms' && RDBMS_TYPES.includes(rdbmsSubTypeToAppType(connection?.rdbms?.type))) {
    // rdbms subtype is required to filter the connections
    expression.push({ 'rdbms.type': connection.rdbms.type });
  } else if ((type === 'rest' && connection?.isHTTP !== true) || (type === 'http' && connection?.http?.formType === 'rest')) {
    expression.push({ $or: [{ 'http.formType': 'rest' }, { type: 'rest' }] });
  } else if (type === 'graph_ql' || (type === 'http' && connection?.http?.formType === 'graph_ql')) {
    expression.push({ $or: [{ 'http.formType': 'graph_ql' }] });
  } else if (type === 'http' || (type === 'rest' && connection?.isHTTP === true)) {
    if (connection.http?._httpConnectorId) {
      const httpConnectorId = getHttpConnector(connection?.http?._httpConnectorId);

      if (httpConnectorId) {
        expression.push({ 'http._httpConnectorId': connection.http._httpConnectorId });
      }
    }

    if (type === 'rest' && connection?.isHTTP === true) {
      expression.push({$or: [{ type: 'rest' }, { type: 'http' }]});
      expression.push({ isHTTP: { $ne: false } });
    } else if (type === 'http') {
      expression.push({$or: [{ type: 'rest' }, { type: 'http' }]});
      expression.push({ isHTTP: { $ne: false } });
    } else {
      expression.push({ 'http.formType': { $ne: 'rest' } });
      expression.push({ type });
    }
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
  const andingExpressions = { $and: expression };
  const connector = getHttpConnector(connection?.http?._httpConnectorId);

  if (connector) {
    return {
      filter: andingExpressions,
      appType: getConnectorId(connector.legacyId, connector.name),
    };
  }

  if (assistant) {
    const filterExpression = getFilterExpressionForAssistant(assistant, expression);

    options = { filter: filterExpression, appType: assistant };
  } else if (type === 'jdbc') {
    options = {
      filter: andingExpressions,
      appType: connection?.jdbc?.type,
    };
  } else {
    options = {
      filter: andingExpressions,
      appType: type === 'rdbms' ? rdbmsSubTypeToAppType(connection?.rdbms?.type) : type,
    };
  }

  return options;
};
export const getConstantContactVersion = connection =>
  connection?.http?.baseURI?.includes('api.cc.email') ? 'constantcontactv3' : 'constantcontactv2';
export const getEbayType = connection =>
  connection?.http?.baseURI?.includes('apiz') ? 'ebayfinance' : 'ebay';
const getRecurlyType = connection => {
  const addversion = connection?.http?.unencrypted?.version;

  switch (addversion) {
    case 'v3':
      return 'recurlyv3';
    default:
  }

  return 'recurly';
};
const getAmazonMWSType = connection => {
  const httpType = connection?.http?.type;

  switch (httpType) {
    case 'Amazon-SP-API':
      return 'amazonsellingpartner';
    default:
  }

  return 'amazonmws';
};
const getLoopReturnsVersion = connection => {
  const baseUri = connection?.http?.baseURI;

  switch (baseUri) {
    case 'https://api.loopreturns.com/api/v2':
      return 'loopreturnsv2';
    default:
  }

  return 'loopreturns';
};
const getAcumaticaEndpointName = connection => {
  const acumaticaEndpointName = connection?.http?.unencrypted?.endpointName;

  switch (acumaticaEndpointName) {
    case 'ecommerce':
      return 'acumaticaecommerce';
    case 'manufacturing':
      return 'acumaticamanufacturing';
    default:
  }

  return 'acumatica';
};
export const getAssistantFromConnection = (assistant, connection) => {
  if (!MULTIPLE_AUTH_TYPE_ASSISTANTS.includes(assistant)) { return assistant; }

  if (assistant?.includes('constantcontact')) {
    return getConstantContactVersion(connection);
  }
  if (assistant === ('ebay' || 'ebayfinance')) {
    return getEbayType(connection);
  }
  if (assistant === 'amazonmws') {
    return getAmazonMWSType(connection);
  }
  if (assistant === 'recurly') {
    return getRecurlyType(connection);
  }
  if (assistant === 'loopreturns') {
    return getLoopReturnsVersion(connection);
  }
  if (assistant === 'acumatica') {
    return getAcumaticaEndpointName(connection);
  }

  return assistant;
};
export const KBDocumentation = {
  http: 'https://docs.celigo.com/hc/en-us/sections/360007388192-HTTP-',
  rest: 'https://docs.celigo.com/hc/en-us/sections/360007479711-REST',
  ftp: 'https://docs.celigo.com/hc/en-us/articles/360045263152-Set-up-an-FTP-connection-',
  as2: 'https://docs.celigo.com/hc/en-us/articles/360029551372-Set-up-an-AS2-connection',
  van: 'https://docs.celigo.com/hc/en-us/articles/12532496305819-Set-up-a-value-added-network-VAN-connection',
  mongodb: 'https://docs.celigo.com/hc/en-us/articles/360039632032-Set-up-a-connection-to-MongoDB',
  mysql: 'https://docs.celigo.com/hc/en-us/articles/360038611852-Set-up-a-connection-to-MySQL',
  mssql: 'https://docs.celigo.com/hc/en-us/articles/360039003951-Set-up-a-connection-to-Microsoft-SQL',
  oracle: 'https://docs.celigo.com/hc/en-us/articles/360050360312-Set-up-a-connection-to-Oracle-DB-SQL-',
  postgresql: 'https://docs.celigo.com/hc/en-us/articles/360038997991-Set-up-a-connection-to-PostgreSQL',
  snowflake: 'https://docs.celigo.com/hc/en-us/articles/360048048792-Set-up-a-connection-to-Snowflake',
  dynamodb: 'https://docs.celigo.com/hc/en-us/articles/360039720112-Set-up-a-connection-to-DynamoDB',
  netsuite: 'https://docs.celigo.com/hc/en-us/articles/360038996151-Set-up-a-connection-to-NetSuite',
  s3: 'https://docs.celigo.com/hc/en-us/articles/360038373912-Set-up-a-connection-to-Amazon-S3',
  salesforce: 'https://docs.celigo.com/hc/en-us/sections/360007478991-Salesforce-',
  amazonvendorcentral: 'https://docs.celigo.com/hc/en-us/articles/13497353678747',
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
  ARBP9OOSHTCHU: 'https://sellercentral.amazon.eg/apps/authorize/consent',
  A17E79C6D8DWNP: 'https://sellercentral.amazon.sa/apps/authorize/consent',
  AMEN7PMS3EDWL: 'https://sellercentral.amazon.com.be/apps/authorize/consent',
};
export const amazonVendorCentralAuthURI = {
  A2EUQ1WTGCTBG2: 'https://vendorcentral.amazon.ca/apps/authorize/consent',
  ATVPDKIKX0DER: 'https://vendorcentral.amazon.com/apps/authorize/consent',
  A1AM78C64UM0Y8: 'https://vendorcentral.amazon.com.mx/apps/authorize/consent',
  A2Q3Y263D00KWC: 'https://vendorcentral.amazon.com.br/apps/authorize/consent',
  A1RKKUPIHCS9HS: 'https://vendorcentral.amazon.es/apps/authorize/consent',
  A1F83G8C2ARO7P: 'https://vendorcentral.amazon.co.uk/apps/authorize/consent',
  A13V1IB3VIYZZH: 'https://vendorcentral.amazon.fr/apps/authorize/consent',
  A1805IZSGTT6HS: 'https://vendorcentral.amazon.nl/apps/authorize/consent',
  A1PA6795UKMFR9: 'https://vendorcentral.amazon.de/apps/authorize/consent',
  APJ6JRA9NG5V4: 'https://vendorcentral.amazon.it/apps/authorize/consent',
  A2NODRKZP88ZB9: 'https://vendorcentral.amazon.se/apps/authorize/consent',
  A1C3SOZRARQ6R3: 'https://vendorcentral.amazon.pl/apps/authorize/consent',
  A33AVAJ2PDY3EV: 'https://vendorcentral.amazon.com.tr/apps/authorize/consent',
  A2VIGQ35RCS4UG: 'https://vendorcentral.amazon.me/apps/authorize/consent',
  A21TJRUUN4KGV: 'https://vendorcentral.amazon.in/apps/authorize/consent',
  A19VAU5U5O7RUS: 'https://vendorcentral.amazon.com.sg/apps/authorize/consent',
  A39IBJ37TRP1C6: 'https://vendorcentral.amazon.com.au/apps/authorize/consent',
  A1VC38T7YXB528: 'https://vendorcentral.amazon.co.jp/apps/authorize/consent',
  ARBP9OOSHTCHU: 'https://vendorcentral.amazon.me/apps/authorize/consent',
  AMEN7PMS3EDWL: 'https://vendorcentral.amazon.com.be/apps/authorize/consent',
  A17E79C6D8DWNP: 'https://vendorcentral.amazon.me/apps/authorize/consent',
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
    {label: 'Egypt', value: 'ARBP9OOSHTCHU'},
    {label: 'Turkey', value: 'A33AVAJ2PDY3EV'},
    {label: 'Saudi Arabia', value: 'A17E79C6D8DWNP'},
    {label: 'United Arab Emirates', value: 'A2VIGQ35RCS4UG'},
    {label: 'India', value: 'A21TJRUUN4KGV'},
    {label: 'Belgium', value: 'AMEN7PMS3EDWL'},
  ],
  farEast: [
    {label: 'Singapore', value: 'A19VAU5U5O7RUS'},
    {label: 'Australia', value: 'A39IBJ37TRP1C6'},
    {label: 'Japan', value: 'A1VC38T7YXB528'},
  ],
};
export const amazonVendorCentralMarketPlaceOptions = {
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
    {label: 'Egypt', value: 'ARBP9OOSHTCHU'},
    {label: 'Turkey', value: 'A33AVAJ2PDY3EV'},
    {label: 'Saudi Arabia', value: 'A17E79C6D8DWNP'},
    {label: 'United Arab Emirates', value: 'A2VIGQ35RCS4UG'},
    {label: 'India', value: 'A21TJRUUN4KGV'},
    {label: 'Belgium', value: 'AMEN7PMS3EDWL'},
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
  farEast: 'https://sellingpartnerapi-fe.amazon.com/',
};

export const amazonSellerCentralBaseUriForMWSConnection = {
  north_america: 'https://mws.amazonservices.com',
  europe: 'https://mws-eu.amazonservices.com',
  india: 'https://mws.amazonservices.in',
  china: 'https://mws.amazonservices.com.cn',
  japan: 'https://mws.amazonservices.jp',
  australia: 'https://mws.amazonservices.com.au',
};

export const RESOURCE_DRAWER_PATH = '/:operation(add|edit)/:parentType/:parentId';
export const CONN_DRAWER_PATH = '/:operation(add|edit|configure)/connections/:connId';
export const ICLIENT_DRAWER_PATH = '/:operation(add|edit)/iClients/:iClientId';
export const INTEGRATION_DRAWER_PATH = '/integrations/:integrationId/';

// given a url, this util returns the path params
// to identify the parent export/import type and id
// This is used when a connection is opened inside a resource
export const getParentResourceContext = (url, resourceType) => {
  if (!url) return {};

  if (resourceType === 'iClients') {
    return matchPath(url, {
      path: [
        `/**${RESOURCE_DRAWER_PATH}${CONN_DRAWER_PATH}${ICLIENT_DRAWER_PATH}`,
        `/**${CONN_DRAWER_PATH}${ICLIENT_DRAWER_PATH}`,
      ],
      exact: true})?.params || {};
  }
  if (resourceType === 'integrations') {
    return matchPath(url, {
      path: [
        `${INTEGRATION_DRAWER_PATH}**`,
      ],
      exact: true,
    })?.params || {};
  }

  return matchPath(url, {
    path: `/**${RESOURCE_DRAWER_PATH}${CONN_DRAWER_PATH}`,
    exact: true})?.params || {};
};
export const getConnectionApi = connection => {
  let baseURI = '';

  if (connection?.type === 'rest') {
    baseURI = connection.rest?.baseURI;
  } else if (connection?.type === 'http') {
    baseURI = connection.http?.baseURI;
  } else { return null; }

  if (baseURI?.includes('{{{connection.')) {
    baseURI = baseURI.replaceAll('}}}', '{{{');
    let list = baseURI.split('{{{');

    list = list.map(l => {
      if (l.includes('connection.')) {
        let placeHolderArray = l.replace('connection.', '');

        placeHolderArray = placeHolderArray.split('.');
        let evaluatedOutput = {...connection};

        placeHolderArray.forEach(p => {
          evaluatedOutput = evaluatedOutput?.[p];
        });

        return evaluatedOutput || `{{{${l}}}}`;
      }

      return l;
    });
    baseURI = list.join('');
  }

  return baseURI;
};
