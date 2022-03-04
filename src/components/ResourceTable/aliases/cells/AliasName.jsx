import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import InfoIconButton from '../../../InfoIconButton';

const useStyles = makeStyles(() => ({
  root: {
  },
}));

export default function AliasName({ alias, description }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography>{alias}</Typography>
      {description && <InfoIconButton info={description} escapeUnsecuredDomains size="xs" />}
    </div>
  );
}
