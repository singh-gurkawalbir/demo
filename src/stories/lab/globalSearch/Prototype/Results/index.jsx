import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { filterMap } from '../filterMeta';
import GenericRow from './types/Generic';
import ConnectionRow from './types/Connection';

// TODO: We need to create custom row types for several of
// the resource types. Only common resource types can use the
// generic row item.
const rowTypeMap = {
  integrations: GenericRow,
  flows: GenericRow,
  connections: ConnectionRow,
  imports: GenericRow,
  exports: GenericRow,
  scripts: GenericRow,
  agents: GenericRow,
  stacks: GenericRow,
  apis: GenericRow,
  accesstokens: GenericRow,
  templates: GenericRow,
  connectors: GenericRow,
  recycleBin: GenericRow,
  marketplaceTemplates: GenericRow,
  marketplaceConnectors: GenericRow,
};

const useStyles = makeStyles(theme => ({
  root: {
  },
  typeContainer: {
    marginBottom: theme.spacing(1.5),
  },
}));

export default function Results({ results }) {
  const classes = useStyles();

  if (!results?.length) {
    return (
      <Typography>No results</Typography>
    );
  }
  // console.log(results);

  return (
    <div className={classes.root}>
      {results.map(({type, results: typeResults}) => (
        <div key={type} className={classes.typeContainer}>
          <Typography variant="subtitle2">{filterMap[type]?.label.toUpperCase()}</Typography>
          {typeResults.map(r => {
            const Row = rowTypeMap[type];

            return <Row key={r.id} result={r} />;
          })}
        </div>
      ))}
    </div>
  );
}
