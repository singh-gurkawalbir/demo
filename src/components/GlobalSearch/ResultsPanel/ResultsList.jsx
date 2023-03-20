import React from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { filterMap } from '../filterMeta';
import GenericRow from './types/Generic';
import ConnectedRow from './types/Connected';
import RecycleBinRow from './types/RecycleBin';
import MarketplaceRow from './types/Marketplace';
import NoResultTypography from '../../NoResultTypography';
import { NO_RESULT_SEARCH_MESSAGE } from '../../../constants';

// TODO: We need to create custom row types for several of
// the resource types. Only common resource types can use the
// generic row item.
const rowTypeMap = {
  connections: ConnectedRow,
  agents: ConnectedRow,
  recycleBin: RecycleBinRow,
  marketplaceTemplates: MarketplaceRow,
  marketplaceConnectors: MarketplaceRow,
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
  noResults: {
    marginTop: theme.spacing(2),
  },
}));

function ResultsList({ results, currentFocussed }) {
  const classes = useStyles();

  if (!results?.length) {
    return (
      <div className={classes.root}>
        <NoResultTypography>{NO_RESULT_SEARCH_MESSAGE}</NoResultTypography>
      </div>
    );
  }
  // Since the foccussed items fall in different sections
  // we keep the row index count from each section for proper focus
  let currentRowIndex = -1;

  return (
    <div className={classes.root}>
      {results.map(({type, results: typeResults}) => (
        <div key={type} className={classes.typeContainer}>
          <Typography color="textSecondary" variant="overline">{filterMap[type]?.label}</Typography>
          {typeResults.map((result, index) => {
            currentRowIndex += 1;
            const Row = rowTypeMap[type] || GenericRow;
            const includeDivider = typeResults.length > 1 && index > 0;

            return (
              <Row
                focussed={currentRowIndex === currentFocussed}
                key={result?._id}
                result={result}
                type={type}
                includeDivider={includeDivider} />
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default ResultsList;
