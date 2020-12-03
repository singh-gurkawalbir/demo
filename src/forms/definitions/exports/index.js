import inputFilter from './inputFilter';
import test from './testLimit';
import delta from './delta';
import once from './once';
import valueDelta from './valueDelta';
import webhook from './webhook';
import distributed from './distributed';
import filter from './filter';
import rest from './rest';
import ftp from './ftp';
import subForms from './subForms';
import http from './http';
import netsuite from './netsuite';
import rdbms from './rdbms';
import s3 from './s3';
import salesforce from './salesforce';
import wrapper from './wrapper';
import mongodb from './mongodb';
import as2 from './as2';
// import common from './common';
import newExport from './new';
import custom from './custom';
import simple from './simple';
import dynamodb from './dynamodb';

export default {
  new: newExport,
  // common, //ghost code
  inputFilter, // ghost code
  test,
  delta,
  once,
  valueDelta, // ghost code
  webhook,
  distributed,
  filter, // ghost code
  ftp,
  rest,
  subForms,
  http,
  netsuite,
  rdbms,
  s3,
  salesforce,
  wrapper,
  mongodb,
  as2,
  custom,
  simple,
  dynamodb,
};
