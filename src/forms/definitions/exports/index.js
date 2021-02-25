import delta from './delta';
import once from './once';
import webhook from './webhook';
import distributed from './distributed';
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
import newExport from './new';
import custom from './custom';
import simple from './simple';
import dynamodb from './dynamodb';
import googledrive from './googledrive';

export default {
  new: newExport,
  delta,
  once,
  webhook,
  distributed,
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
  googledrive,
};
