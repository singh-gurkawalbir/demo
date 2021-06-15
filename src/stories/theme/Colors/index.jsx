import React from 'react';
import { Typography } from '@material-ui/core';
import SwatchSet from '../SwatchSet';
import colors from '../../../theme/colors';

export default function CeligoColor() {
  return (
    <>
      <Typography variant="h3">Celigo Colors</Typography>

      <SwatchSet name="Accent Colors" colors={colors.accent} />
      <SwatchSet name="Neutral Colors" colors={colors.neutral} />
      <SwatchSet name="Sandbox Colors" colors={colors.sandbox} />
      <SwatchSet name="Success Colors" colors={colors.success} />
      <SwatchSet name="Warning Colors" colors={colors.warning} />
      <SwatchSet name="Error Colors" colors={colors.error} />
    </>
  );
}
