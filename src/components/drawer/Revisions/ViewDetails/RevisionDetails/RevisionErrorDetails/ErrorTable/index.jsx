import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import rfdc from 'rfdc';
import { selectors } from '../../../../../../../reducers';
import CeligoTable from '../../../../../../CeligoTable';
import revisionErrorsMetadata from '../../../../../../ResourceTable/revisionErrors/metadata';
import ErrorInfoDrawer from '../ErrorInfoDrawer';

const clone = rfdc({proto: true});

const useStyles = makeStyles(() => ({
  errorTable: {
    width: '100%',
  },
}));

export default function ErrorTable({ integrationId, revisionId }) {
  const classes = useStyles();
  const revisionErrors = useSelector(state => selectors.revisionErrors(state, integrationId, revisionId));

  if (!revisionErrors?.length) {
    return <div> No errors </div>;
  }

  return (
    <>
      <CeligoTable {...revisionErrorsMetadata} data={clone(revisionErrors)} className={classes.errorTable} />
      <ErrorInfoDrawer integrationId={integrationId} revisionId={revisionId} />
    </>
  );
}
