import React from 'react';
import { useTheme, useMediaQuery, IconButton } from '@material-ui/core';
import CeligoDivider from '../../../CeligoDivider';
import IconTextButton from '../../../IconTextButton';
import Icon from '../../../icons/InstallationGuideIcon';

const helpUrl = 'https://docs.celigo.com/hc/en-us/articles/360039326071-Handlebars-helper-reference';

export default function HandlebarGuide() {
  const theme = useTheme();
  const hasWideScreen = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      {hasWideScreen ? (
        <IconTextButton
          component="a"
          href={helpUrl}
          target="_blank"
          variant="text"><Icon />
          Handlebar guide
        </IconTextButton>
      ) : (
        <IconButton
          component="a"
          href={helpUrl}
          target="_blank">
          <Icon />
        </IconButton>
      )}

      <CeligoDivider position="right" />
    </>
  );
}
