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
import newImport from './new';

export default {
  common,
  ftp,
  subForms,
  http,
  rest,
  mongodb,
  s3,
  wrapper,
  as2,
  rdbms,
  new: newImport,
};
