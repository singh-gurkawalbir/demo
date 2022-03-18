import React from 'react';
import { makeStyles, useTheme, useMediaQuery, IconButton, Tooltip } from '@material-ui/core';
import Icon from '../../../icons/InstallationGuideIcon';
import { TextButton } from '../../../Buttons';

const useStyles = makeStyles({
  button: {
    marginRight: '0 !important',
  },
});

const anchorProps = {
  component: 'a',
  target: '_blank',
  href: 'https://docs.celigo.com/hc/en-us/articles/360039326071-Handlebars-helper-reference',
};

export default function HandlebarGuide() {
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
        <Tooltip title="Handlebars guide" placement="bottom" aria-label="handlebars guide" >
          <IconButton
            {...anchorProps}
            className={classes.button}
            aria-label="handlebars guide">
            <Icon />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}
