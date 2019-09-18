import ftp from './ftp';
import common from './common';
import subForms from './subForms';
import http from './http';
import rest from './rest';
import mongodb from './mongodb';
import s3 from './s3';
import wrapper from './wrapper';
import as2 from './as2';
import rdbms from './rdbms';
import netsuite from './netsuite';
import netsuiteDistributed from './netsuiteDistributed';
import salesforce from './salesforce';
import newImport from './new';

export default {
  common,
  ftp,
  subForms,
  http,
  rest,
  mongodb,
  s3,
  new: newImport,
  wrapper,
  as2,
  rdbms,
  netsuite,
  netsuiteDistributed,
  salesforce,
};
