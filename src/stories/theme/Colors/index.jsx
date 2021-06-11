import React from 'react';
import { Typography } from '@material-ui/core';
import SwatchSet from '../SwatchSet';

const colorSets = {

  Error: {
    celigoError: '#FF3C3C',
    celigoErrorDark: '#D9534F',
  },
  Success: {
    celigoSuccess: '#4CBB02',
    celigoSuccessDark: '#5CB85C',
  },
  Warning: {
    celigoWarning: '#FFB30C',
  },
  Accent: {
    celigoAccent1: '#0E7DC1',
    celigoAccent2: '#1D76C7',
    celigoAccent3: '#00A1E1',
    celigoAccent4: '#37B5ED',
    celigoAccent5: '#12C7FF',
  },
  Neutral: {
    celigoNeutral1: '#F8FAFF',
    celigoNeutral2: '#F0F5F9',
    celigoNeutral3: '#D6E4ED',
    celigoNeutral4: '#B1C6D7',
    celigoNeutral5: '#95ABBC',
    celigoNeutral6: '#677A89',
    celigoNeutral7: '#424E59',
    celigoNeutral8: '#333D47',
    celigoNeutral9: '#2A3138',
    celigoNeutral10: '#0B0C0E',
  },
  Sandbox: {
    celigoSandbox1: '#F5F5F0',
    celigoSandbox2: '#B49569',
    celigoSandbox3: '#A58559',
    celigoSandbox4: '#806A4B',
    celigoSandbox5: '#625544',
  },
  Other: {
    celigoWhite: '#FFFFFF',
  },
};

export default function CeligoColor() {
  return (
    <>
      <Typography variant="h3">Celigo Colors</Typography>

      <SwatchSet name="Accent" colors={colorSets.Accent} />
      <SwatchSet name="Neutral" colors={colorSets.Neutral} />
      <SwatchSet name="Sandbox" colors={colorSets.Sandbox} />
      <SwatchSet name="Success" colors={colorSets.Success} />
      <SwatchSet name="Warning" colors={colorSets.Warning} />
      <SwatchSet name="Error" colors={colorSets.Error} />
      <SwatchSet name="Other" colors={colorSets.other} />
    </>
  );
}
