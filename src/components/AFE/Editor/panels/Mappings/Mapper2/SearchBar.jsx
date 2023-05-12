import React, {useEffect, useCallback} from 'react';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import {SearchInput} from '@celigo/fuse-ui';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import ActionGroup from '../../../../../ActionGroup';
import CloseIcon from '../../../../../icons/CloseIcon';
import IconButtonWithTooltip from '../../../../../IconButtonWithTooltip';
import useDebouncedValue from '../../../../../../hooks/useDebouncedInput';
import { emptyList } from '../../../../../../constants';
import NotificationToaster from '../../../../../NotificationToaster';

const useStyles = makeStyles(theme => ({
  searchWrapper: {
    backgroundColor: theme.palette.secondary.lightest,
    display: 'flex',
    padding: theme.spacing(1, 2),
    position: 'absolute',
    width: '100%',
    zIndex: theme.zIndex.drawer,
  },
  searchCount: {
    marginRight: theme.spacing(1),
    whiteSpace: 'nowrap',
  },
  showSearchCount: {
    display: 'flex',
    alignItems: 'center',
  },
  infoFilter: {
    paddingLeft: 0,
    '& svg': {
      color: theme.palette.text.secondary,
    },
  },
}));

// display when search has been done
const SearchCount = () => {
  const classes = useStyles();
  const totalMatches = useSelector(state => selectors.filteredV2TreeData(state).searchCount);

  return (
    <div className={classes.showSearchCount}>
      <Typography variant="body2" className={classes.searchCount}>
        {totalMatches ? `${totalMatches} ${totalMatches === 1 ? 'match' : 'matches'}` : '0 matches'}
      </Typography>

      {totalMatches ? (
        <NotificationToaster
          variant="info"
          transparent
          italic
          noBorder
          className={classes.infoFilter}>
          Adding a row closes search mode
        </NotificationToaster>
      ) : null}

    </div>
  );
};

export default function SearchBar() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const expandedKeys = useSelector(state => selectors.filteredV2TreeData(state).expandedKeys || emptyList);
  const searchKey = useSelector(state => selectors.searchKey(state));
  const [text, setText] = useDebouncedValue('', value => {
    dispatch(actions.mapping.v2.searchTree(value));
  });

  useEffect(() => {
    // update the expanded keys based on the search
    if (searchKey) {
      dispatch(actions.mapping.v2.updateExpandedKeys(expandedKeys));
    }
  // we don't need expandedKeys as the dependency here as this action should be dispatched only when search is changed
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchKey]);

  const handleKeywordChange = useCallback(value => {
    setText(value);
  }, [setText]);

  const onCloseHandler = useCallback(() => {
    dispatch(actions.mapping.v2.searchTree(undefined));
  }, [dispatch]);

  return (
    <div className={classes.searchWrapper}>
      <ActionGroup>
        <SearchInput
          defaultValue={text}
          onChange={handleKeywordChange}
          className={classes.searchField}
          sx={{
            backgroundColor: 'background.paper',
            borderColor: 'primary.main',
            height: 29,
          }}
          placeholder="Search destination fields"
          autoFocus
        />

        {searchKey && <SearchCount />}

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
