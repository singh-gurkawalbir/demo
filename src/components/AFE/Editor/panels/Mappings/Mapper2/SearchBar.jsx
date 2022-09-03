import React, {useEffect, useCallback} from 'react';
import { IconButton, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import ArrowUpIcon from '../../../../../icons/ArrowUpIcon';
import KeywordSearch from '../../../../../KeywordSearch';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import ActionGroup from '../../../../../ActionGroup';
import CloseIcon from '../../../../../icons/CloseIcon';
import IconButtonWithTooltip from '../../../../../IconButtonWithTooltip';

const useStyles = makeStyles(theme => ({
  searchWrapper: {
    backgroundColor: theme.palette.secondary.lightest,
    display: 'flex',
    padding: theme.spacing(1, 2),
  },
  searchField: {
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.primary.main,
    height: 29,
  },
  searchCount: {
    marginRight: theme.spacing(1),
  },
  showSearchCount: {
    display: 'flex',
    alignItems: 'center',
  },
}));

// display when search has been done
const ShowAfterSearch = ({
  className,
  matches,
  downClickHandler,
  upClickHandler,
}) => (
  <div className={className}>
    {matches}
    <IconButton size="small" onClick={downClickHandler}>
      <ArrowDownIcon />
    </IconButton>
    <IconButton size="small" onClick={upClickHandler}>
      <ArrowUpIcon />
    </IconButton>
  </div>
);

export default function SearchBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const highlightedIndex = useSelector(state => selectors.highlightedIndex(state));
  const fields = useSelector(state => selectors.filteredKeys(state));
  const fieldsLen = fields.length;
  const searchKey = useSelector(state => selectors.filter(state, 'tree')?.keyword);

  useEffect(() => {
    dispatch(actions.mapping.v2.searchTree(searchKey, false));
  }, [dispatch, searchKey]);

  // clear the filter and filteredKeys and index
  useEffect(() => () => {
    dispatch(actions.clearFilter('tree'));
    dispatch(actions.mapping.v2.updateHighlightedIndex(-1));
  }, [dispatch]);

  const downClickHandler = useCallback(() => {
    if (highlightedIndex < 0 || !fieldsLen) return;
    // using tempHighlightIndex to select the correct selected field after updating highlightIndex state
    let tempHighlightedIndex;

    if (highlightedIndex >= 0 && highlightedIndex < fieldsLen - 1) {
      dispatch(actions.mapping.v2.updateHighlightedIndex(highlightedIndex + 1));
      tempHighlightedIndex = highlightedIndex + 1;
    }
    if (highlightedIndex === fieldsLen - 1) {
      dispatch(actions.mapping.v2.updateHighlightedIndex(0));
      tempHighlightedIndex = 0;
    }
    dispatch(actions.mapping.v2.searchTree(fields[tempHighlightedIndex], true));
  }, [dispatch, fields, fieldsLen, highlightedIndex]);

  const upClickHandler = useCallback(() => {
    if (highlightedIndex < 0 || !fieldsLen) return;
    // using tempHighlightIndex to select the correct selected field after updating highlightIndex state
    let tempHighlightedIndex;

    if (highlightedIndex > 0 && highlightedIndex < fieldsLen) {
      dispatch(actions.mapping.v2.updateHighlightedIndex(highlightedIndex - 1));
      tempHighlightedIndex = highlightedIndex - 1;
    }
    if (highlightedIndex === 0) {
      dispatch(actions.mapping.v2.updateHighlightedIndex(fieldsLen - 1));
      tempHighlightedIndex = fieldsLen - 1;
    }
    dispatch(actions.mapping.v2.searchTree(fields[tempHighlightedIndex], true));
  }, [dispatch, fields, fieldsLen, highlightedIndex]);

  const onCloseHandler = useCallback(() => {
    dispatch(actions.mapping.v2.toggleSearch());
  }, [dispatch]);

  // display the number of matches found
  const matches = fieldsLen ? (<Typography variant="body2">{highlightedIndex + 1} of {fieldsLen} matches</Typography>)
    : (<Typography variant="body2" className={classes.searchCount}>0 of 0 matches</Typography>);

  return (
    <div className={classes.searchWrapper}>
      <ActionGroup>
        <KeywordSearch
          isHomeSearch
          filterKey="tree"
          className={classes.searchField}
          placeHolder="Search destination fields"
          openWithFocus
        />
        {searchKey && (
        <ShowAfterSearch
          className={classes.showSearchCount}
          matches={matches}
          upClickHandler={upClickHandler}
          downClickHandler={downClickHandler}
        />
        )}
      </ActionGroup>
      <ActionGroup position="right">
        <IconButtonWithTooltip
          tooltipProps={{title: 'Close search'}}
          buttonSize={{size: 'small'}}
          onClick={onCloseHandler}>
          <CloseIcon />
        </IconButtonWithTooltip>

      </ActionGroup>
    </div>
  );
}
