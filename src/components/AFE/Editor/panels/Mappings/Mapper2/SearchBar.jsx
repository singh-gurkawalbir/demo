import React, {useEffect, useCallback} from 'react';
import { IconButton, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import ArrowUpIcon from '../../../../../icons/ArrowUpIcon';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import ActionGroup from '../../../../../ActionGroup';
import CloseIcon from '../../../../../icons/CloseIcon';
import IconButtonWithTooltip from '../../../../../IconButtonWithTooltip';
import HomeSearchInput from '../../../../../SearchInput/HomeSearchInput';
import useDebouncedValue from '../../../../../../hooks/useDebouncedInput';

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
  fieldsLen,
  highlightedIndex,
}) => (
  <div className={className}>
    { fieldsLen ? (<Typography variant="body2">{highlightedIndex + 1} of {fieldsLen} matches</Typography>)
      : (<Typography variant="body2" className={className.searchCount}>0 of 0 matches</Typography>)}
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
  const fieldsLen = useSelector(state => selectors.filteredKeys(state).length);
  const [text, setText] = useDebouncedValue('', value => {
    dispatch(actions.mapping.v2.searchTree({ searchKey: value, showKey: false }));
  });

  // clear the filter and filteredKeys and index
  useEffect(() => () => {
    dispatch(actions.mapping.v2.updateHighlightedIndex(-1));
  }, [dispatch]);

  const handleKeywordChange = useCallback(e => {
    setText(e.target.value);
  }, [setText]);

  const downClickHandler = useCallback(() => {
    if (highlightedIndex < 0 || !fieldsLen) return;

    // increase highlighIndex if in range 0 to fieldsLen - 2
    if (highlightedIndex >= 0 && highlightedIndex < fieldsLen - 1) {
      dispatch(actions.mapping.v2.updateHighlightedIndex(highlightedIndex + 1));
    }
    // set to 0 if highlightIndex is fieldslen - 1
    if (highlightedIndex === fieldsLen - 1) {
      dispatch(actions.mapping.v2.updateHighlightedIndex(0));
    }
    // finding the specific highlighted key
    dispatch(actions.mapping.v2.searchTree({ showKey: true }));
  }, [dispatch, fieldsLen, highlightedIndex]);

  const upClickHandler = useCallback(() => {
    if (highlightedIndex < 0 || !fieldsLen) return;

    // decrease highlighIndex if in range 1 to fieldsLen - 1
    if (highlightedIndex > 0 && highlightedIndex < fieldsLen) {
      dispatch(actions.mapping.v2.updateHighlightedIndex(highlightedIndex - 1));
    }
    // set to fieldsLen - 1 if highlightIndex is 0
    if (highlightedIndex === 0) {
      dispatch(actions.mapping.v2.updateHighlightedIndex(fieldsLen - 1));
    }
    // finding the specific highlighted key
    dispatch(actions.mapping.v2.searchTree({ showKey: true }));
  }, [dispatch, fieldsLen, highlightedIndex]);

  const onCloseHandler = useCallback(() => {
    dispatch(actions.mapping.v2.searchTree({ searchKey: undefined, showKey: false }));
  }, [dispatch]);

  return (
    <div className={classes.searchWrapper}>
      <ActionGroup>
        <HomeSearchInput
          value={text}
          onChange={handleKeywordChange}
          className={classes.searchField}
          placeHolder="Search destination fields"
          openWithFocus
        />
        {text && (
        <ShowAfterSearch
          className={classes.showSearchCount}
          fieldsLen={fieldsLen}
          highlightedIndex={highlightedIndex}
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
