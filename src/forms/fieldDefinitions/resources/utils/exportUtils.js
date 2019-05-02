export default function(resource, connection) {
  let toReturn = '';

  if (resource.type === 'simple') {
    toReturn = 'File';
  } else if (resource.type === 'distributed') {
    if (connection && connection.type) {
      toReturn = connection.type === 'netsuite' ? 'NetSuite' : 'Salesforce';
    } else {
      toReturn = 'NetSuite';
    }
  } else if (resource.type === 'webhook') {
    toReturn = 'Webhook';
  } else if (
    (resource.netsuite && resource.netsuite.type) ||
    (resource.type === 'blob' && resource.netsuite.internalId)
  ) {
    toReturn = 'NetSuite';
  } else if (resource.rest && resource.rest.relativeURI) {
    toReturn = 'REST API';
  } else if (
    resource.http &&
    resource.http.method &&
    resource.http.method !== ''
  ) {
    toReturn = 'HTTP';
  } else if (resource.wrapper && resource.wrapper.function) {
    toReturn = 'Wrapper';
  } else if (
    (resource.salesforce && resource.salesforce.soql.query) ||
    (resource.type === 'blob' && resource.salesforce.sObjectType)
  ) {
    toReturn = 'Salesforce';
  } else if (resource.ftp && resource.ftp.directoryPath) {
    // INT-881
    toReturn = 'FTP';
  } else if (connection && connection.type === 'as2') {
    toReturn = 'AS2';
  } else if (resource.s3 && resource.s3.bucket) {
    toReturn = 'Amazon S3';
  } else if (resource.rdbms && resource.rdbms.query) {
    if (connection && connection.rdbms && connection.rdbms.type === 'mysql') {
      toReturn = 'MySQL';
    } else if (
      connection &&
      connection.rdbms &&
      connection.rdbms.type === 'mssql'
    ) {
      toReturn = 'Microsoft SQL';
    } else {
      toReturn = 'PostgreSQL';
    }
  } else if (resource.mongodb && resource.mongodb.collection) {
    toReturn = 'MongoDB';
  }

  return toReturn.toLowerCase();
}
