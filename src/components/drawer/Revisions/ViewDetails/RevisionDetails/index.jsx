import { useSelector } from 'react-redux';
import {
  AccordionSummary,
  AccordionDetails,
  Accordion,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useState } from 'react';
import ExpandMoreIcon from '../../../../icons/ArrowDownIcon';
import DateTimeDisplay from '../../../../DateTimeDisplay';
import { selectors } from '../../../../../reducers';
import { REVISION_STATUS_LABELS, REVISION_TYPE_LABELS } from '../../../../../utils/revisions';
import { REVISION_STATUS, REVISION_TYPES } from '../../../../../constants';
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
    '& b': {
      marginRight: theme.spacing(1),
    },
  },
  container: {
    margin: theme.spacing(2),
  },
}));

const RevisionInfoRow = ({ children }) => {
  const classes = useStyles();

  return (
    <Typography variant="body2" className={classes.revisionInfoRow}>
      <b>{children[0]}</b>
      <span>{children[1]}</span>
    </Typography>
  );
};

const RevisionCreatedBy = ({ integrationId, revisionId }) => {
  const revision = useSelector(state => selectors.revision(state, integrationId, revisionId));
  const userName = useSelector(state => {
    const users = selectors.allUsersList(state, integrationId);

    const user = users.find(user => revision?._createdByUserId === user.sharedWithUser._id);

    if (!user) return revision?._createdByUserId;

    return user.sharedWithUser.name || user.sharedWithUser.email;
  });

  return userName || null;
};

const RevertDetails = ({ integrationId, revisionId }) => {
  const revision = useSelector(state => selectors.revision(state, integrationId, revisionId));
  const revertToRevision = useSelector(state => selectors.revision(state, integrationId, revision._revertToRevisionId));

  return (
    <>
      <RevisionInfoRow>
        Reverted from revision description:
        {revertToRevision.description}
      </RevisionInfoRow>
      <RevisionInfoRow>
        Date created:
        <DateTimeDisplay dateTime={revision.createdAt} />
      </RevisionInfoRow>
      <RevisionInfoRow>
        Reverted from created date:
        <DateTimeDisplay dateTime={revertToRevision.createdAt} />
      </RevisionInfoRow>
      <RevisionInfoRow>
        Type:
        {REVISION_TYPE_LABELS[revision.type]}
      </RevisionInfoRow>
      <RevisionInfoRow>
        Status:
        {REVISION_STATUS_LABELS[revision.status]}
      </RevisionInfoRow>
      <RevisionInfoRow>
        Created by:
        <RevisionCreatedBy integrationId={integrationId} revisionId={revisionId} />
      </RevisionInfoRow>
      <RevisionInfoRow>
        Revision ID:
        {revision._id}
      </RevisionInfoRow>
    </>
  );
};
const SnapshotDetails = ({ integrationId, revisionId }) => {
  const revision = useSelector(state => selectors.revision(state, integrationId, revisionId));

  return (
    <>
      <RevisionInfoRow>
        Date created:
        <DateTimeDisplay dateTime={revision.createdAt} />
      </RevisionInfoRow>
      <RevisionInfoRow>
        Created by:
        <RevisionCreatedBy integrationId={integrationId} revisionId={revisionId} />
      </RevisionInfoRow>
      <RevisionInfoRow>
        Type:
        {REVISION_TYPE_LABELS[revision.type]}
      </RevisionInfoRow>
      <RevisionInfoRow>
        Status:
        {REVISION_STATUS_LABELS[revision.status]}
      </RevisionInfoRow>
      <RevisionInfoRow>
        Revision ID:
        {revision._id}
      </RevisionInfoRow>
    </>
  );
};
const PullDetails = ({ integrationId, revisionId }) => {
  const revision = useSelector(state => selectors.revision(state, integrationId, revisionId));

  return (
    <>
      <RevisionInfoRow>
        Date created:
        <DateTimeDisplay dateTime={revision.createdAt} />
      </RevisionInfoRow>
      <RevisionInfoRow>
        Type:
        {REVISION_TYPE_LABELS[revision.type]}
      </RevisionInfoRow>
      <RevisionInfoRow>
        Status:
        {REVISION_STATUS_LABELS[revision.status]}
      </RevisionInfoRow>
      <RevisionInfoRow>
        Created by:
        <RevisionCreatedBy integrationId={integrationId} revisionId={revisionId} />
      </RevisionInfoRow>
      <RevisionInfoRow>
        From integration name:
        <ResourceLnk
          name={revision.fromIntegrationName}
          id={revision._fromIntegrationId}
          resourceType="integrations" />
      </RevisionInfoRow>

      <RevisionInfoRow>
        From integration ID:
        {revision._fromIntegrationId}
      </RevisionInfoRow>
      <RevisionInfoRow>
        From environment:
        {revision.fromIntegrationIsSandbox ? ' Sandbox' : ' Production'}
      </RevisionInfoRow>
      <RevisionInfoRow>
        Revision ID:
        {revision._id}
      </RevisionInfoRow>
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
