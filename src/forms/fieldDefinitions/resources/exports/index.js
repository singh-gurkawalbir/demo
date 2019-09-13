import as2 from './as2';
import abstractExport from './export';
import file from './file';
import ftp from './ftp';
import http from './http';
import mongodb from './mongodb';
import netsuite from './netsuite';
import rdbms from './rdbms';
import rest from './rest';
import s3 from './s3';
import salesforce from './salesforce';
import wrapper from './wrapper';
import custom from './custom';

const allFieldDefinitions = {
  ...as2,
  ...file,
  ...ftp,
  ...http,
  ...mongodb,
  ...netsuite,
  ...rdbms,
  ...rest,
  ...s3,
  ...salesforce,
  ...wrapper,
  ...abstractExport,
  ...custom,
};

export default allFieldDefinitions;
