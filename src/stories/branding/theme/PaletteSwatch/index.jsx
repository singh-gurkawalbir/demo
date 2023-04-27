import React from 'react';
import { useTheme, Typography } from '@mui/material';
import SwatchSet from '../SwatchSet';

export default function PaletteSwatch() {
  const theme = useTheme();

  return (
    <>
      <Typography variant="h3">Celigo Theme</Typography>

      <SwatchSet name="Primary" colors={theme.palette.primary} />
      <SwatchSet name="Secondary" colors={theme.palette.secondary} />
      <SwatchSet name="Background" colors={theme.palette.background} />
      <SwatchSet name="Text" colors={theme.palette.text} />
      <SwatchSet name="Info" colors={theme.palette.info} whitelist={['main', 'contrastText']} />
      <SwatchSet name="Error" colors={theme.palette.error} whitelist={['main', 'dark', 'contrastText']} />
      <SwatchSet name="Warning" colors={theme.palette.warning} whitelist={['main', 'contrastText']} />
      <SwatchSet name="Success" colors={theme.palette.success} whitelist={['main', 'dark', 'contrastText']} />
    </>
  );
}
