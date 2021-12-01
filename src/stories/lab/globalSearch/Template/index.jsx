/* eslint-disable no-console */
import React from 'react';
import { makeStyles } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { action } from '@storybook/addon-actions';
import GlobalSearchProto from '../Prototype';

const useStyles = makeStyles(() => ({
  templateRoot: {
    display: 'flex',
    justifyContent: 'space-around',
  },
}));

const handleKeywordChange = action('onKeywordChange');
const handleFiltersChange = action('onFiltersChange:');

export default function Template(args) {
  const classes = useStyles();

  return (
    <div className={classes.templateRoot}>
      <GlobalSearchProto
        onKeywordChange={handleKeywordChange}
        onFiltersChange={handleFiltersChange}
        {...args} />
    </div>
  );
}
