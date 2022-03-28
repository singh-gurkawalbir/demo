import { useSelector } from 'react-redux';
import {
  AccordionSummary,
  AccordionDetails,
  Accordion,
  Typography,
} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import React, { useState } from 'react';
import ExpandMoreIcon from '../../../../icons/ArrowDownIcon';
import DateTimeDisplay from '../../../../DateTimeDisplay';
import { selectors } from '../../../../../reducers';
import { REVISION_STATUS_LABELS, REVISION_TYPE_LABELS } from '../../../../../utils/revisions';
import { REVISION_STATUS, REVISION_TYPES } from '../../../../../utils/constants';
import RevisionErrorDetails from './RevisionErrorDetails';
import ResourceLnk from '../../../../ResourceLink';

const useStyles = makeStyles(theme => ({
  accordionDetails: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    flexDirection: 'column',
    padding: theme.spacing(2),
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
    '&:last-child': {
      marginBottom: 0,
    },
  },
  container: {
    margin: theme.spacing(2),
  },
}));

const RevisionCreatedBy = ({ integrationId, revisionId }) => {
  const revision = useSelector(state => selectors.revision(state, integrationId, revisionId));
  const userName = useSelector(state => {
    const users = selectors.availableUsersList(state, integrationId);

    const user = users.find(user => revision?._createdByUserId === user.sharedWithUser._id);

    if (!user) return revision?._createdByUserId;

    return user.sharedWithUser.name || user.sharedWithUser.email;
  });

  return userName || null;
};

const RevertDetails = ({ integrationId, revisionId }) => {
  const classes = useStyles();

  const revision = useSelector(state => selectors.revision(state, integrationId, revisionId));
  const revertToRevision = useSelector(state => selectors.revision(state, integrationId, revision._revertToRevisionId));

  return (
    <>
      <Typography variant="body2" className={classes.revisionInfoRow}>
        <b>Reverted from revision description:</b> {revertToRevision.description}
      </Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Date created:</b> <DateTimeDisplay dateTime={revision.createdAt} /></Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Reverted from created date:</b> <DateTimeDisplay dateTime={revertToRevision.createdAt} /></Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Type:</b> {REVISION_TYPE_LABELS[revision.type]}</Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Status:</b> {REVISION_STATUS_LABELS[revision.status]}</Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Created by:</b>
        <RevisionCreatedBy integrationId={integrationId} revisionId={revisionId} />
      </Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Revision ID:</b> {revision._id}</Typography>
    </>
  );
};
const SnapshotDetails = ({ integrationId, revisionId }) => {
  const classes = useStyles();
  const revision = useSelector(state => selectors.revision(state, integrationId, revisionId));

  return (
    <>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Date created:</b> <DateTimeDisplay dateTime={revision.createdAt} /></Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Created by:</b>
        <RevisionCreatedBy integrationId={integrationId} revisionId={revisionId} />
      </Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Type:</b> {REVISION_TYPE_LABELS[revision.type]}</Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Status:</b> {REVISION_STATUS_LABELS[revision.status]}</Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Revision ID:</b> {revision._id}</Typography>
    </>
  );
};
const PullDetails = ({ integrationId, revisionId }) => {
  const classes = useStyles();
  const revision = useSelector(state => selectors.revision(state, integrationId, revisionId));

  return (
    <>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Date created:</b> <DateTimeDisplay dateTime={revision.createdAt} /></Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Type:</b> {REVISION_TYPE_LABELS[revision.type]}</Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Status:</b> {REVISION_STATUS_LABELS[revision.status]}</Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Created by:</b>
        <RevisionCreatedBy integrationId={integrationId} revisionId={revisionId} />
      </Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}>
        <b>From integration name: </b>
        <ResourceLnk
          name={revision.fromIntegrationName}
          id={revision._fromIntegrationId}
          resourceType="integrations" />
      </Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>From integration ID:</b> {revision._fromIntegrationId}</Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>From environment:</b>
        {revision.fromIntegrationIsSandbox ? ' Sandbox' : ' Production'}
      </Typography>
      <Typography variant="body2" className={classes.revisionInfoRow}><b>Revision ID:</b> {revision._id}</Typography>
    </>
  );
};

function RevisionInfo({ integrationId, revisionId }) {
  const revisionType = useSelector(state => selectors.revisionType(state, integrationId, revisionId));

  if (revisionType === REVISION_TYPES.PULL) {
    return <PullDetails integrationId={integrationId} revisionId={revisionId} />;
  }
  if (revisionType === REVISION_TYPES.REVERT) {
    return <RevertDetails integrationId={integrationId} revisionId={revisionId} />;
  }

  return <SnapshotDetails integrationId={integrationId} revisionId={revisionId} />;
}

export default function RevisionDetails({ integrationId, revisionId }) {
  const classes = useStyles();
  const [shouldExpand, setShouldExpand] = useState(true);
  const isInvalidRevision = useSelector(state =>
    !selectors.revision(state, integrationId, revisionId)
  );
  const isFailedRevision = useSelector(state =>
    selectors.revision(state, integrationId, revisionId)?.status === REVISION_STATUS.FAILED
  );

  if (isInvalidRevision) {
    return null;
  }

  return (
    <>
      <div className={classes.container}>
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
            <RevisionInfo integrationId={integrationId} revisionId={revisionId} />
          </AccordionDetails>
        </Accordion>
      </div>
      {
        isFailedRevision && (
        <div className={classes.container}>
          <RevisionErrorDetails
            integrationId={integrationId}
            revisionId={revisionId} />
        </div>
        )
      }
    </>
  );
}
