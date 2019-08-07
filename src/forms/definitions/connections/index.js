import rdbms from './rdbms';
import rest from './rest';
import http from './http';
import ftp from './ftp';
import s3 from './s3';
import as2 from './as2';
import netsuite from './netsuite';
import netSuiteDistributedAdaptor from './netSuiteDistributedAdaptor';
import salesforce from './salesforce';
import wrapper from './wrapper';
import mongodb from './mongodb';
import custom from './custom';
import newImport from './new';
import subForms from './subForms';

export default {
  new: newImport,
  rdbms,
  rest,
  http,
  ftp,
  s3,
  as2,
  netsuite,
  netSuiteDistributedAdaptor,
  salesforce,
  wrapper,
  mongodb,
  custom,
  subForms,
};
