import React from 'react';
import { useTheme, useMediaQuery, IconButton, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { TextButton } from '@celigo/fuse-ui';
import Icon from '../../../../icons/InstallationGuideIcon';
import { REVISIONS_GUIDE_URL } from '../../../../../constants';

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
          sx={{mr: '0 !important'}}
          startIcon={<Icon />}>
          Revisions guide
        </TextButton>
      ) : (
        <Tooltip title="Revisions guide" placement="bottom" aria-label="revisions guide" >
          <IconButton
            {...anchorProps}
            className={classes.button}
            aria-label="revisions guide"
            size="large">
            <Icon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}
