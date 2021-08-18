import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';

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
  if (type.toLowerCase().includes('ftp')) return 'ftp';

  if (type.toLowerCase().includes('http')) return 'http';

  if (type.toLowerCase().includes('rest')) return 'rest';

  if (type.toLowerCase().includes('mysql')) return 'mysql';

  if (type.toLowerCase().includes('microsoftsql')) return 'mssql';

  if (type.toLowerCase().includes('postgresql')) return 'postgresql';

  if (type.toLowerCase().includes('netsuite')) return 'netsuite';

  if (type.toLowerCase().includes('salesforce')) return 'salesforce';

  if (type.toLowerCase().includes('webhook')) return 'webhook';

  if (type.toLowerCase().includes('mongodb')) return 'mongodb';

  if (type.toLowerCase().includes('dynamodb')) return 'dynamodb';

  if (type.toLowerCase().includes('as2')) return 'as2';

  if (type.toLowerCase().includes('wrapper')) return 'wrapper';

  if (type.toLowerCase().includes('rdbms')) return 'rdbms';

  // 's3' are too few words that it could be contained in lot more words. In current list of applications, it matches with 'msdynamics360'.
  // Hence expilicity check for S3Export and S3Import for S3 type.
  if (['s3export', 's3import'].includes(type.toLowerCase())) return 's3';

  // remove all whitespaces and dots
  return type.replace(/\.|\s/g, '');
}

function imageName(assistant) {
  // The Ad-blocker plugins and some browsers in-built ad-blockers are blocking image with name googleads.png, hence prefixing image name with small-
  if (assistant === 'googleads') {
    return 'small-googleads';
  }

  return assistant;
}

export default function ApplicationImg({
  size = 'small',
  markOnly = false,
  assistant,
  type,
  alt = 'Application image',
  className,
}) {
  const classes = useStyles();
  let path = `${process.env.CDN_BASE_URI}images/`;

  if (!assistant) {
    if (markOnly) {
      path += `react/application-logos/small/${iconMap(type)}.png`;
    } else {
      path += `react/application-logos/large/${iconMap(
        type
      )}.png`;
    }
  } else if (markOnly) {
    path += `react/application-logos/small/${imageName(assistant)}.png`;
  } else {
    path += `react/application-logos/large/${assistant}.png`;
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
