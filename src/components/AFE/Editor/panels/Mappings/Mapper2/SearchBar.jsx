import React, {useEffect, useCallback} from 'react';
import { IconButton, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import ArrowUpIcon from '../../../../../icons/ArrowUpIcon';
import KeywordSearch from '../../../../../KeywordSearch';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import ActionGroup from '../../../../../ActionGroup';
import CloseIcon from '../../../../../icons/CloseIcon';

const SearchBar = () => {
  const dispatch = useDispatch();
  // const [isSearching, setIsSearching] = useState(true);
  const highlightedIndex = useSelector(state => selectors.highlightedIndex(state));
  const fieldsLen = useSelector(state => selectors.selectedFields(state).length);
  const fields = useSelector(state => selectors.selectedFields(state));
  const searchKey = useSelector(state => selectors.filter(state, 'tree')?.keyword);
  // let highlightedKey = useSelector(state => selectors.selectedFields(state));

  // const filterTreeNode = useCallback(node => filterNode(node.generate, searchKey), [searchKey]);
  // const filterTreeKey = useCallback(node => filterKey(node.key, highlightedKey), [highlightedKey]);
  // const filterFunction = useMemo(() => isSearching ? filterTreeNode : filterTreeKey, [isSearching, filterTreeNode, filterTreeKey]);

  // useEffect(() => setIsSearching(true), [searchKey]);

  // useEffect(() => {
  //   const expandedKeys = [];
  //   const selectedFields = [];

  // const objectSearch = node => {
  //   // eslint-disable-next-line no-use-before-define
  //   const firstIndex = simpleSearch(node.mappings);
  //   let found = false;

  //   if (firstIndex !== -1) {
  //     found = true;
  //     expandedKeys.push(node.key);
  //     // console.log({ expandedKeys });
  //   }

  //   return found;
  // };

  // const objectArraySearch = node => {
  //   // eslint-disable-next-line no-use-before-define
  //   const firstIndex = simpleSearch(node.children);
  //   let found = false;
  //   const extractList = node.combinedExtract.split(',');

  //   // console.log('objectArray', firstIndex);

  //   if (firstIndex !== -1) {
  //     found = true;
  //     expandedKeys.push(node.key);
  //     const childNode = node.children[firstIndex];

  //     if (extractList.length > 1) {
  //       const tabValue = getExtractTabValue(childNode.parentExtract, node.combinedExtract);

  //       dispatch(actions.mapping.v2.changeArrayTab(node.key, tabValue, childNode.parentExtract));
  //     }
  //   }

  //   return found;
  // };

  // const simpleSearch = mappings => {
  //   let firstIndex = -1;

  //   mappings.forEach((node, index) => {
  //     if (node.isTabNode) return;
  //     let found = false;

  //     if (node.dataType === 'object') {
  //       found = objectSearch(node);
  //     } else if (node.dataType === 'objectarray') {
  //       found = objectArraySearch(node);
  //     }
  //     if (filterFunction(node)) {
  //       found = true;
  //     }
  //     if (firstIndex === -1 && found) {
  //       firstIndex = index;
  //       selectedFields.push(node.key);
  //     }
  //   });

  //     return firstIndex;
  //   };

  //   if (searchKey && isSearching) {
  //     simpleSearch(treeData);
  //     expandedKeys.length > 0 && dispatch(actions.mapping.v2.updateExpandedKeys(expandedKeys));
  //     selectedFields.length > 0 && dispatch(actions.mapping.v2.updateSelectedFields(selectedFields));
  //     selectedFields.length > 0 && dispatch(actions.mapping.v2.updateHighlightedIndex(0));
  //   }
  //   if (!isSearching) {
  //     simpleSearch(treeData);
  //   }
  // }, [dispatch, filterFunction, isSearching, searchKey]);

  useEffect(() => {
    dispatch(actions.mapping.v2.searchTree(searchKey, false));
    // items = simpleSearch(treeData, searchKey);
    // console.log(items);
  }, [dispatch, searchKey]);

  const downClickHandler = useCallback(() => {
    // console.log("downClick", highlightedIndex, highlightedKey, fieldsLen);
    if (highlightedIndex < 0 || !fieldsLen) return;
    let hi;

    if (highlightedIndex >= 0 && highlightedIndex < fieldsLen - 1) {
      dispatch(actions.mapping.v2.updateHighlightedIndex(highlightedIndex + 1));
      hi = highlightedIndex + 1;
    }
    if (highlightedIndex === fieldsLen - 1) {
      dispatch(actions.mapping.v2.updateHighlightedIndex(0));
      hi = 0;
    }
    dispatch(actions.mapping.v2.searchTree(fields[hi], true));
  }, [dispatch, fields, fieldsLen, highlightedIndex]);

  const upClickHandler = useCallback(() => {
    // console.log("upClick", highlightedIndex, highlightedKey, fieldsLen);
    if (highlightedIndex < 0 || !fieldsLen) return;
    let hi;

    if (highlightedIndex > 0 && highlightedIndex < fieldsLen) {
      dispatch(actions.mapping.v2.updateHighlightedIndex(highlightedIndex - 1));
      hi = highlightedIndex - 1;
    }
    if (highlightedIndex === 0) {
      dispatch(actions.mapping.v2.updateHighlightedIndex(fieldsLen - 1));
      hi = fieldsLen - 1;
    }
    dispatch(actions.mapping.v2.searchTree(fields[hi], true));
  }, [dispatch, fields, fieldsLen, highlightedIndex]);

  const matches = fieldsLen ? (<Typography variant="body2">{highlightedIndex + 1} of {fieldsLen} matches</Typography>)
    : (<Typography variant="body2">0 of 0 matches</Typography>);

  const ShowAfterSearch = () => (
    <div>
      {matches}
      <IconButton size="small" onClick={downClickHandler}>
        <ArrowDownIcon />
      </IconButton>
      <IconButton size="small" onClick={upClickHandler}>
        <ArrowUpIcon />
      </IconButton>
    </div>
  );

  return (
    <div>
      <ActionGroup>
        <KeywordSearch isHomeSearch filterKey="tree" placeHolder="Search destination fields" />
        {searchKey && <ShowAfterSearch />}
      </ActionGroup>
      <ActionGroup position="right">
        <IconButton size="small">
          <CloseIcon />
        </IconButton>
      </ActionGroup>
    </div>
  );
};

export default SearchBar;
