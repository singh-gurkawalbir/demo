// import { useSelector } from 'react-redux';
import {
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import ExpandMoreIcon from '../../../../../icons/ArrowDownIcon';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import ErrorTable from './ErrorTable';

const useStyles = makeStyles(theme => ({
  accordionDetails: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    padding: 0,
  },
  accordionSummary: {
    width: '100%',
    cursor: 'default !important',
  },
  accordionWrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: theme.spacing(2),
  },
  revisionInfoRow: {
    marginBottom: theme.spacing(2),
  },
}));

export default function RevisionErrorDetails({ integrationId, revisionId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [shouldExpand, setShouldExpand] = useState(true);

  // selectors
  const isErrorsFetchInProgress = useSelector(state => selectors.isRevisionErrorsFetchInProgress(state, integrationId, revisionId));
  const isRevisionErrorsRequested = useSelector(state => selectors.isRevisionErrorsRequested(state, integrationId, revisionId));
  // end selectors

  useEffect(() => {
    if (!isRevisionErrorsRequested) {
      dispatch(actions.integrationLCM.revision.fetchErrors(integrationId, revisionId));
    }
  }, [dispatch, integrationId, isRevisionErrorsRequested, revisionId]);

  if (isErrorsFetchInProgress) {
    return <Spinner sx={{textAlign: 'center'}} />;
  }

  return (
    <Accordion
      elevation={0}
      square
      className={classes.accordionWrapper}
      expanded={shouldExpand}>
      <AccordionSummary
        className={classes.accordionSummary}
        expandIcon={<ExpandMoreIcon onClick={() => setShouldExpand(expand => !expand)} />}>
        Errors
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <ErrorTable integrationId={integrationId} revisionId={revisionId} />
      </AccordionDetails>
    </Accordion>
  );
}
