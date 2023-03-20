import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import getImageUrl from '../../../utils/image';

const mapTypes = type => {
  switch (type) {
    case 'exports':
      return 'export';
    case 'imports':
      return 'import';
    case 'asynchelpers':
      return 'export';
    default:
      return type;
  }
};
const useStyles = makeStyles(theme => ({
  small: {
    maxWidth: theme.spacing(4),
    maxHeight: theme.spacing(4),
  },
  large: {
    maxWidth: theme.spacing(8),
    maxHeight: theme.spacing(8),
  },
}));

export default function ResourceImg(props) {
  const { size = 'small', resourceType } = props;
  const classes = useStyles();

  return (
    <img
      className={classes[size]}
      alt={resourceType}
      src={getImageUrl(`io-icons/icon-${mapTypes(resourceType)}.svg`)}
    />
  );
}
