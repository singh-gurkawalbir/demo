import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import KnowledgeBaseIcon from '../icons/KnowledgeBaseIcon';
import { HELP_CONTENT_FEATURE_ENABLED } from '../../constants';
import helpContent from '../../utils/helpContent';

const useStyles = makeStyles(() => ({
  helpButton: {
    paddingLeft: 7,
  },
}));

export default function HelpDocumentationLink({ contentId }) {
  const link = helpContent.documentationLinks[contentId];
  const classes = useStyles();

  return HELP_CONTENT_FEATURE_ENABLED && link ? (
    <Tooltip title="help article" placement="top">
      <div className={classes.helpButton}>
        <a href={link} rel="noreferrer" target="_blank">
          <KnowledgeBaseIcon />
        </a>
      </div>
    </Tooltip>
  ) : null;
}
