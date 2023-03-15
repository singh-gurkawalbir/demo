import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import getImageUrl from '../../../utils/image';
import { getHttpConnector } from '../../../constants/applications';

const useStyles = makeStyles(theme => ({
  small: {
    maxHeight: '26px',
  },
  medium: {
    maxHeight: theme.spacing(7),
  },
  large: {
    maxWidth: theme.spacing(16),
    maxHeight: theme.spacing(16),
  },
}));

function iconMap(type = '') {
  if (type.toLowerCase().includes('http')) return 'http';

  if (type.toLowerCase().includes('mysql')) return 'mysql';

  if (type.toLowerCase().includes('microsoftsql')) return 'mssql';

  if (type.toLowerCase().includes('postgresql')) return 'postgresql';

  if (type.toLowerCase().includes('netsuite')) return 'netsuite';

  if (type.toLowerCase().includes('salesforce')) return 'salesforce';

  if (type.toLowerCase().includes('webhook')) return 'webhook';

  if (type.toLowerCase().includes('mongodb')) return 'mongodb';

  if (type.toLowerCase().includes('dynamodb')) return 'dynamodb';

  if (type.toLowerCase().includes('as2')) return 'as2';

  if (type.toLowerCase().includes('van')) return 'van';

  if (type.toLowerCase().includes('wrapper')) return 'wrapper';

  if (type.toLowerCase().includes('rdbms')) return 'rdbms';

  if (type.toLowerCase().includes('bigquery')) return 'bigquery';

  if (type.toLowerCase().includes('redshift')) return 'redshift';

  if (['restexport', 'restimport'].includes(type.toLocaleLowerCase())) return 'rest';
  // 's3' are too few words that it could be contained in lot more words. In current list of applications, it matches with 'msdynamics360'.
  // Hence expilicity check for S3Export and S3Import for S3 type.
  if (['s3export', 's3import'].includes(type.toLowerCase())) return 's3';
  if (['ftpexport', 'ftpimport'].includes(type.toLowerCase())) return 'ftp';
  const typeCheck = type.toLowerCase();

  const publishedConnector = getHttpConnector(type);

  if (publishedConnector) {
    return (publishedConnector.legacyId || publishedConnector.name).toLowerCase().replace(/\.|\s/g, '');
  }

  // remove all whitespaces and dots
  return typeCheck.replace(/\.|\s/g, '');
}

function imageName(assistant) {
  // The Ad-blocker plugins and some browsers in-built ad-blockers are blocking image with name googleads.png, hence prefixing image name with small-
  if (assistant === 'googleads') {
    return 'small-googleads';
  }

  // For both the Google BigQuery and Google BigQuery (REST API) applications, we have the same image
  if (assistant === 'bigquerydatawarehouse') {
    return 'bigquery';
  }

  // Similarly for both Amazon Redshift and Amazon Redshift (REST API) applications, we have same image
  if (assistant === 'redshiftdatawarehouse') {
    return 'redshift';
  }

  const publishedConnector = getHttpConnector(assistant);

  if (publishedConnector) {
    return (publishedConnector.legacyId || publishedConnector.name).toLowerCase().replace(/\.|\s/g, '');
  }

  return assistant.toLowerCase().replace(/\.|\s/g, '');
}

export default function ApplicationImg({
  size,
  markOnly = false,
  assistant,
  type,
  alt,
  className,
}) {
  const classes = useStyles();

  // eslint-disable-next-line no-param-reassign
  if (!type) type = '';
  let path;

  if (!assistant) {
    if (markOnly) {
      path = getImageUrl(`images/react/application-logos/small/${iconMap(type)}.png`);
    } else {
      path = getImageUrl(`images/react/application-logos/large/${iconMap(type)}.png`);
    }
  } else if (markOnly) {
    path = getImageUrl(`images/react/application-logos/small/${imageName(assistant)}.png`);
  } else {
    path = getImageUrl(`images/react/application-logos/large/${imageName(assistant)}.png`);
  }

  return (
    <img
      className={clsx(classes[size], className)}
      alt={assistant || alt}
      src={path}
    />
  );
}

ApplicationImg.propTypes = {
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};
ApplicationImg.defaultProps = {
  alt: 'Application image',
  size: 'small',
};
