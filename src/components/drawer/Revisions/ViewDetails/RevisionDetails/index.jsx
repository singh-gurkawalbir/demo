import { useSelector } from 'react-redux';
import {
  AccordionSummary,
  AccordionDetails,
  Accordion,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import React, { useState } from 'react';
import ExpandMoreIcon from '../../../../icons/ArrowDownIcon';
import DateTimeDisplay from '../../../../DateTimeDisplay';
import { selectors } from '../../../../../reducers';
import { REVISION_STATUS_LABELS, REVISION_TYPE_LABELS } from '../../../../../utils/revisions';

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

export default function RevisionDetails({ integrationId, revisionId }) {
  const classes = useStyles();
  const [shouldExpand, setShouldExpand] = useState(true);
  const revision = useSelector(state => selectors.revision(state, integrationId, revisionId));
  const userName = useSelector(state => {
    const users = selectors.availableUsersList(state, integrationId);

    const user = users.find(user => revision?._byUserId === user.sharedWithUser._id);

    if (!user) return revision._byUserId;

    return user.sharedWithUser.name || user.sharedWithUser.email;
  });

  if (!revision) {
    return null;
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
        General
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <div className={classes.revisionInfoRow}>  <b> Description: </b> {revision.description}</div>
        <div className={classes.revisionInfoRow}>  <b> Date created: </b> <DateTimeDisplay dateTime={revision.createdAt} /></div>
        <div className={classes.revisionInfoRow}>  <b> Type: </b> {REVISION_TYPE_LABELS[revision.type]}</div>
        <div className={classes.revisionInfoRow}>  <b> Status: </b> {REVISION_STATUS_LABELS[revision.status]}</div>
        <div className={classes.revisionInfoRow}>  <b> Created by: </b> {userName}</div>
        <div className={classes.revisionInfoRow}>  <b> Revision ID: </b> {revision._id}</div>
      </AccordionDetails>
    </Accordion>
  );
}
