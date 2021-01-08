import React from 'react';
import { makeStyles, useTheme, useMediaQuery, IconButton } from '@material-ui/core';
import CeligoDivider from '../../../CeligoDivider';
import IconTextButton from '../../../IconTextButton';
import Icon from '../../../icons/InstallationGuideIcon';

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
        <IconTextButton {...anchorProps} className={classes.button} variant="text">
          <Icon /> Handlebar guide
        </IconTextButton>
      ) : (
        <IconButton {...anchorProps} className={classes.button} >
          <Icon />
        </IconButton>
      )}

      <CeligoDivider position="right" />
    </>
  );
}
