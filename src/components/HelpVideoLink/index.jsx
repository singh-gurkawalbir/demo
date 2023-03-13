import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import { useSelector, shallowEqual } from 'react-redux';
import VideoIcon from '../icons/VideoIcon';
import helpContent from '../../utils/helpContent';
import { selectors } from '../../reducers';

const useStyles = makeStyles(() => ({
  helpButton: {
    paddingLeft: 7,
  },
}));

export default function HelpVideoLink({ contentId }) {
  const preferences = useSelector(state => selectors.userProfilePreferencesProps(state), shallowEqual);
  const { helpContent: isHelpContentEnabled } = preferences;
  const link = helpContent.videoLinks[contentId];
  const classes = useStyles();

  return isHelpContentEnabled && link ? (
    <Tooltip title="help content" placement="top">
      <div className={classes.helpButton}>
        <a href={link} rel="noreferrer" target="_blank">
          <VideoIcon />
        </a>
      </div>
    </Tooltip>
  ) : null;
}
