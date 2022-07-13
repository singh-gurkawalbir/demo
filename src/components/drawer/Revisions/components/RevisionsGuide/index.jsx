import React from 'react';
import { makeStyles, useTheme, useMediaQuery, IconButton, Tooltip } from '@material-ui/core';
import Icon from '../../../../icons/InstallationGuideIcon';
import { TextButton } from '../../../../Buttons';
import { REVISIONS_GUIDE_URL } from '../../../../../utils/constants';

const useStyles = makeStyles({
  button: {
    marginRight: '0 !important',
  },
});

const anchorProps = {
  component: 'a',
  target: '_blank',
  href: REVISIONS_GUIDE_URL,
};

export default function RevisionsGuide() {
  const theme = useTheme();
  const classes = useStyles();
  const hasWideScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      {hasWideScreen ? (
        <TextButton
          {...anchorProps}
          className={classes.button}
          startIcon={<Icon />}>
          Revisions guide
        </TextButton>
      ) : (
        <Tooltip title="Revisions guide" placement="bottom" aria-label="revisions guide" >
          <IconButton
            {...anchorProps}
            className={classes.button}
            aria-label="revisions guide">
            <Icon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}
