import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../../reducers';

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

    if (
      connection &&
      connection.netsuite &&
      connection.netsuite.dataCenterURLs &&
      connection.netsuite.dataCenterURLs.systemDomain
    ) {
      return connection.netsuite.dataCenterURLs.systemDomain;
    }

    return null;
  });

  return (
    <Typography variant="body1" className={classes.text}>
      Folder:{' '}
      <Link
        className={classes.link}
        target="_blank"
        href={`${netSuiteSystemDomain}/app/common/media/mediaitemfolders.nl?folder=${value[value.length - 1].id}`}>
        {value.map(v => v.name).join(' > ')}
      </Link>
    </Typography>
  );
}
