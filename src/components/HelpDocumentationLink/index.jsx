import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import { useSelector, shallowEqual } from 'react-redux';
import helpContent from '../../utils/helpContent';
import KnowledgeBaseIcon from '../icons/KnowledgeBaseIcon';
import { selectors } from '../../reducers';

const useStyles = makeStyles(() => ({
  helpButton: {
    paddingLeft: 7,
  },
}));

export default function HelpDocumentationLink({ contentId }) {
  const preferences = useSelector(state => selectors.userProfilePreferencesProps(state), shallowEqual);
  const { helpContent: isHelpContentEnabled } = preferences;
  const link = helpContent.documentationLinks[contentId];
  const classes = useStyles();

  return isHelpContentEnabled && link ? (
    <Tooltip title="help article" placement="top">
      <div className={classes.helpButton}>
        <a href={link} rel="noreferrer" target="_blank">
          <KnowledgeBaseIcon />
        </a>
      </div>
    </Tooltip>
  ) : null;
}
