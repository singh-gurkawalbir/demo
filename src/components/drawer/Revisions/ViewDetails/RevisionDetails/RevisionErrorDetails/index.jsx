// import { useSelector } from 'react-redux';
import {
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ExpandMoreIcon from '../../../../../icons/ArrowDownIcon';
import Spinner from '../../../../../Spinner';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';

const useStyles = makeStyles(theme => ({
  accordionDetails: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    display: 'block',
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
  const revisionErrors = useSelector(state => selectors.revisionErrors(state, integrationId, revisionId));
  // end selectors

  useEffect(() => {
    if (!isRevisionErrorsRequested) {
      dispatch(actions.integrationLCM.revision.fetchErrors(integrationId, revisionId));
    }
  }, [dispatch, integrationId, isRevisionErrorsRequested, revisionId]);

  if (isErrorsFetchInProgress) {
    return <Spinner />;
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
        <div> {JSON.stringify(revisionErrors)} </div>
      </AccordionDetails>
    </Accordion>
  );
}
