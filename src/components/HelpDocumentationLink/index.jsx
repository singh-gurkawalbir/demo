import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import helpContent from '../../utils/helpContent';
import KnowledgeBaseIcon from '../icons/KnowledgeBaseIcon';
import { selectors } from '../../reducers';

const useStyles = makeStyles(() => ({
  helpButton: {
    paddingLeft: 7,
  },
}));

export default function HelpDocumentationLink({ contentId }) {
  const isHelpContentEnabled = useSelector(state => selectors.userProfilePreferencesProps(state)?.helpContent);
  const link = helpContent.documentationLinks[contentId];
  const classes = useStyles();

  return isHelpContentEnabled && ENABLE_HELP_CONTENT === 'true' && link ? (
    <Tooltip title="help article " placement="top">
      <div className={classes.helpButton}>
        <a href={link} rel="noreferrer" target="_blank" data-test="helpDocumentLink">
          <KnowledgeBaseIcon />
        </a>
      </div>
    </Tooltip>
  ) : null;
}
