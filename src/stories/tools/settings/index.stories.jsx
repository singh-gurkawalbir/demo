/* eslint-disable no-undef */
import { Typography } from '@material-ui/core';
import React from 'react';

export default {
  title: 'Tools / Settings',
};

const Template = () => {
  const settings = process.env;

  console.log(settings);

  return (
    <>
      <pre>
        {JSON.stringify(settings, null, 2)}
      </pre>
      <Typography>{CDN_BASE_URI}</Typography>
      <Typography>{process.env.CDN_BASE_URI}</Typography>
      <Typography>{process.env.STORYBOOK_FOO}</Typography>
    </>
  );
};

export const EnvVarDump = Template.bind({});

