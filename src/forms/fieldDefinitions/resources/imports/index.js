import as2 from './as2';
import abstractImport from './import';
import ftp from './ftp';
import http from './http';
import mongodb from './mongodb';
import netsuiteDistributed from './netsuiteDistributed';
import rdbms from './rdbms';
import rest from './rest';
import s3 from './s3';
import salesforce from './salesforce';
import wrapper from './wrapper';
import file from './file';
import custom from './custom';

const allFieldDefinitions = {
  ...as2,
  ...abstractImport,
  ...ftp,
  ...http,
  ...mongodb,
  ...netsuiteDistributed,
  ...rdbms,
  ...rest,
  ...s3,
  ...salesforce,
  ...wrapper,
  ...file,
  ...custom,
};

export default allFieldDefinitions;
