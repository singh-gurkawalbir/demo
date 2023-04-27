import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../../../reducers';
import CeligoTable from '../../../../../../CeligoTable';
import revisionErrorsMetadata from '../../../../../../ResourceTable/revisionErrors/metadata';
import ErrorInfoDrawer from '../ErrorInfoDrawer';
import customCloneDeep from '../../../../../../../utils/customCloneDeep';

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
      <CeligoTable {...revisionErrorsMetadata} data={customCloneDeep(revisionErrors)} className={classes.errorTable} />
      <ErrorInfoDrawer integrationId={integrationId} revisionId={revisionId} />
    </>
  );
}
