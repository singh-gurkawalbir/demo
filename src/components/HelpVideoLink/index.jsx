import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import VideoIcon from '../icons/VideoIcon';
import helpContent from '../../utils/helpContent';

const useStyles = makeStyles(() => ({
  helpButton: {
    paddingLeft: 7,
  },
}));

export default function HelpVideoLink({ contentId }) {
  const link = helpContent.videoLinks[contentId];
  const classes = useStyles();

  return ENABLE_HELP_CONTENT === 'true' && link ? (
    <Tooltip title="help content" placement="top">
      <div className={classes.helpButton}>
        <a href={link} rel="noreferrer" target="_blank" data-test="helpVideoLink">
          <VideoIcon />
        </a>
      </div>
    </Tooltip>
  ) : null;
}
