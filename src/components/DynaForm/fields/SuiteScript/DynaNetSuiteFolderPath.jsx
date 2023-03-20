import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Link } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  link: {
    display: 'flex',
    color: theme.palette.secondary.light,
    alignItems: 'center',
    marginTop: -5,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

export default function DynaNetSuiteFolderPath(props) {
  const classes = useStyles();
  const { value, ssLinkedConnectionId } = props;
  const netSuiteSystemDomain = useSelector(state => {
    const connection = selectors.resource(
      state,
      'connections',
      ssLinkedConnectionId
    );

    return connection?.netsuite?.dataCenterURLs?.systemDomain;
  });

  if (!netSuiteSystemDomain) {
    return null;
  }

  return (
    <Typography variant="body1" className={classes.text}>
      Folder:{' '}
      <Link
        className={classes.link}
        target="_blank"
        href={`${netSuiteSystemDomain}/app/common/media/mediaitemfolders.nl?folder=${value[value.length - 1].id}`}
        underline="hover">
        {value.map(v => v.name).join(' > ')}
      </Link>
    </Typography>
  );
}
