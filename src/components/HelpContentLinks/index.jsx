import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import helpContent from '../../utils/helpContent';
import HelpDocumentationLink from '../HelpDocumentationLink';
import HelpVideoLink from '../HelpVideoLink';
import { selectors } from '../../reducers';

const useStyles = makeStyles(theme => ({
  buttonRef: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    paddingTop: theme.spacing(1),
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'row-reverse',
  },
}));

export default function HelpContentLinks({ contentId }) {
  const isHelpContentEnabled = useSelector(state => selectors.userProfilePreferencesProps(state).helpContent);
  const isContentLinkPresent = helpContent.documentationLinks[contentId] || helpContent.videoLinks[contentId];
  const classes = useStyles();

  return isHelpContentEnabled && ENABLE_HELP_CONTENT === 'true' && isContentLinkPresent ? (
    <div className={classes.buttonRef}>
      <HelpDocumentationLink contentId={contentId} />
      <HelpVideoLink contentId={contentId} />
    </div>
  ) : null;
}
