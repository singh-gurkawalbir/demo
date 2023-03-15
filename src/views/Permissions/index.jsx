import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import JsonContent from '../../components/JsonContent';
import { selectors } from '../../reducers';
import CeligoPageBar from '../../components/CeligoPageBar';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
}));

export default function Permissions() {
  const classes = useStyles();
  const permissions = useSelector(state => selectors.userPermissions(state));

  return (
    <>
      <CeligoPageBar title="Permission explorer" />
      <div className={classes.root}>
        <JsonContent json={permissions} />
      </div>
    </>
  );
}
