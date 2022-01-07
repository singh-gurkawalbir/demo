/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import React from 'react';
import { Divider, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import CeligoTimeAgo from '../../../../../../components/CeligoTimeAgo';
import InfoIconButton from '../../../../../../components/InfoIconButton';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0.75),
    width: '100%',
    '&:hover,&:focus': {
      backgroundColor: theme.palette.background.paper2,
      cursor: 'pointer',
      outline: 'unset',
    },
    backgroundColor: ({focussed}) => focussed ? theme.palette.background.paper2 : 'initial',
  },
  filler: {
    flexGrow: 1,
  },
  dataDivider: {
    height: theme.spacing(2),
    width: 1,
    margin: theme.spacing(0, 1),
  },
}));

export default React.forwardRef(({result, children, includeDivider, focussed}, ref) => {
  const classes = useStyles({focussed});
  const history = useHistory();

  if (!result) return null;

  const handleRowClick = () => history.push(result.url);

  return (
    <>
      {includeDivider && <Divider orientation="horizontal" />}
      <div ref={ref} className={classes.root} onClick={handleRowClick}>
        <Typography variant="body2">{result.name || result.id}</Typography>
        {result.description && <InfoIconButton size="xs" info={result.description} />}

        {children && <Divider orientation="vertical" className={classes.dataDivider} />}
        {children}

        <div className={classes.filler} />

        <CeligoTimeAgo date={result.lastModified} />
      </div>
    </>
  );
});
