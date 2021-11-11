import React from 'react';

export default {
  title: 'Tools / Settings',
};

const Template = () => {
  const settings = process.env;

  console.log(settings);

  return (
    <pre>
      {JSON.stringify(settings, null, 2)}
    </pre>
  );
};

export const EnvVarDump = Template.bind({});

