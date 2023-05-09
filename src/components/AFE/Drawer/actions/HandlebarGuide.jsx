import React from 'react';
import { useTheme, useMediaQuery, IconButton, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { TextButton } from '@celigo/fuse-ui';
import CeligoDivider from '../../../CeligoDivider';
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
        <TextButton
          {...anchorProps}
          sx={{mr: '0 !important'}}
          startIcon={<Icon />}>
          Handlebars guide
        </TextButton>
      ) : (
        <Tooltip title="Handlebars guide" placement="bottom" aria-label="handlebars guide" >
          <IconButton
            {...anchorProps}
            className={classes.button}
            aria-label="handlebars guide"
            size="large">
            <Icon />
          </IconButton>
        </Tooltip>
      )}
      <CeligoDivider position="right" />
    </>
  );
}
