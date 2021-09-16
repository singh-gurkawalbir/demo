import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { filterMap } from '../filterMeta';
import GenericRow from './types/Generic';
import ConnectedRow from './types/Connected';
import RecycleBinRow from './types/RecycleBin';

// TODO: We need to create custom row types for several of
// the resource types. Only common resource types can use the
// generic row item.
const rowTypeMap = {
  integrations: GenericRow,
  flows: GenericRow,
  connections: ConnectedRow,
  imports: GenericRow,
  exports: GenericRow,
  scripts: GenericRow,
  agents: ConnectedRow,
  stacks: GenericRow,
  apis: GenericRow,
  accesstokens: GenericRow,
  templates: GenericRow,
  connectors: GenericRow,
  recycleBin: RecycleBinRow,
  marketplaceTemplates: GenericRow,
  marketplaceConnectors: GenericRow,
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    overflowY: 'auto',
    paddingTop: 8,
    paddingRight: 8,
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

  return (
    <div className={classes.root}>
      {results.map(({type, results: typeResults}) => (
        <div key={type} className={classes.typeContainer}>
          <Typography color="textSecondary" variant="overline">{filterMap[type]?.label}</Typography>
          {typeResults.map((r, i) => {
            const Row = rowTypeMap[type];
            const includeDivider = typeResults.length > 1 && i > 0;

            return <Row key={r.id} result={r} includeDivider={includeDivider} />;
          })}
        </div>
      ))}
    </div>
  );
}

