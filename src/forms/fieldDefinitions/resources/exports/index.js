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

const allFieldDefinitions = {
  ...as2,
  ...abstractExport,
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
};

export default allFieldDefinitions;
