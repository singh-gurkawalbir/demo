import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import SearchInput from './SearchInput';
import ResultsPanel from '../ResultsPanel';
import { useGlobalSearchState } from '../GlobalSearchContext/createGlobalSearchState';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

const isResultsOpenSelector = state => {
  let {keyword} = state;

  if (keyword?.includes(':')) {
    const keywordTokens = keyword.split(':');

    keyword = keywordTokens[keywordTokens.length - 1].trim();
  }

  return keyword?.length > 1;
};
export default function SearchBox() {
  const classes = useStyles();
  const isResultsOpen = useGlobalSearchState(isResultsOpenSelector);

  return (
    <div className={classes.root}>
      <SearchInput />
      {isResultsOpen && <ResultsPanel />}
    </div>
  );
}
