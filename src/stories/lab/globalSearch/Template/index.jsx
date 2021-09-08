/* eslint-disable no-console */
import React from 'react';
import { makeStyles } from '@material-ui/core';
import GlobalSearchProto from '../Prototype';

const useStyles = makeStyles(() => ({
  templateRoot: {
    display: 'flex',
    justifyContent: 'space-around',
  },
}));

const handleKeywordChange = keyword => { console.log('onKeywordChange:', keyword); };
const handleFiltersChange = filters => { console.log('onFiltersChange:', filters); };

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
