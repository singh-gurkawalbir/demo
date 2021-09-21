import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Chip } from '@material-ui/core';
import InfoIconButton from '../../../../InfoIconButton';
import { flowbuilderUrl } from '../../../../../utils/flows';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
    maxWidth: 300,
    wordWrap: 'break-word',
  },
  freeTag: {
    margin: theme.spacing(1),
    color: theme.palette.background.paper,
  },
  flowLink: {
    display: 'inline',
    transition: theme.transitions.create('color'),
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
}));

export default function NameCell({
  name,
  description,
  isFree,
  flowId,
  isIntegrationApp,
  integrationId,
  childId,
  actionProps,
}) {
  const classes = useStyles();
  const isDataLoader = !!actionProps?.flowAttributes[flowId]?.isDataLoader;
  const flowName = name || `Unnamed (id: ${flowId})`;
  const flowBuilderTo = flowbuilderUrl(flowId, integrationId, {childId, isIntegrationApp, appName: actionProps?.appName, isDataLoader});

  return (
    <div className={classes.root}>
      <Link to={flowBuilderTo}>{flowName}</Link>

      <InfoIconButton info={description} escapeUnsecuredDomains size="xs" />

      {isFree && (
        <Chip
          label="Free"
          color="primary"
          size="small"
          className={classes.freeTag}
        />
      )}
    </div>
  );
}
