import React from 'react';
import { Typography } from '@mui/material';
import SwatchSet from '../SwatchSet';
import colors from '../../../../theme/colors';

export default function CeligoColor() {
  return (
    <>
      <Typography variant="h3">Celigo Colors</Typography>

      <SwatchSet name="Accent" colors={colors.accent} />
      <SwatchSet name="Neutral" colors={colors.neutral} />
      <SwatchSet name="Sandbox" colors={colors.sandbox} />
      <SwatchSet name="Success" colors={colors.success} />
      <SwatchSet name="Warning" colors={colors.warning} />
      <SwatchSet name="Error" colors={colors.error} />
    </>
  );
}
