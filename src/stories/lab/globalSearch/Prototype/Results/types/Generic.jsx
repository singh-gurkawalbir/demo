import React from 'react';
import { Divider, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CeligoTimeAgo from '../../../../../../components/CeligoTimeAgo';
import InfoIconButton from '../../../../../../components/InfoIconButton';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    // justifyContent: 'space-between',
    padding: theme.spacing(0, 0.5),
    width: '100%',
    '&:hover': {
      backgroundColor: theme.palette.background.paper2,
      cursor: 'pointer',
    },
  },
  filler: {
    flexGrow: 1,
  },
  divider: {
    height: theme.spacing(3),
    width: 1,
    margin: theme.spacing(0, 1),
  },
}));

export default function Generic({result, children}) {
  const classes = useStyles();
  const history = useHistory();

  if (!result) return null;

  const handleRowClick = () => history.push(result.url);

  return (
    <div className={classes.root} onClick={handleRowClick}>
      <Typography>
        {result.name || result.id}
      </Typography>
      {result.description && <InfoIconButton size="xs" info={result.description} />}
      {children && <Divider orientation="vertical" className={classes.divider} />}
      {children}

      <div className={classes.filler} />

      <CeligoTimeAgo date={result.lastModified} />
    </div>
  );
}
