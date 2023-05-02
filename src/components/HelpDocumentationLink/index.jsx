import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import helpContent from '../../utils/helpContent';
import KnowledgeBaseIcon from '../icons/KnowledgeBaseIcon';

const useStyles = makeStyles(() => ({
  helpButton: {
    paddingLeft: 7,
  },
}));

export default function HelpDocumentationLink({ contentId }) {
  const link = helpContent.documentationLinks[contentId];
  const classes = useStyles();

  return ENABLE_HELP_CONTENT === 'true' && link ? (
    <Tooltip title="help article " placement="top">
      <div className={classes.helpButton}>
        <a href={link} rel="noreferrer" target="_blank" data-test="helpDocumentLink">
          <KnowledgeBaseIcon />
        </a>
      </div>
    </Tooltip>
  ) : null;
}
