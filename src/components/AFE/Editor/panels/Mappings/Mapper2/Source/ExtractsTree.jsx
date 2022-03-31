import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import Tree from 'rc-tree';
import {isEmpty} from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Typography } from '@material-ui/core';
import {SwitcherIcon} from '../index';
import {selectors} from '../../../../../../../reducers';
import {filterExtractsNode, getFinalSelectedExtracts, getAllKeys} from '../../../../../../../utils/mapping';
import { useSelectorMemo } from '../../../../../../../hooks';

const useStyles = makeStyles(theme => ({
  dropdown: {
    backgroundColor: 'white',
    position: 'absolute',
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
    top: 'calc(100% - 1px)',
    borderWidth: '0px 1px 1px 1px',
    borderColor: '#d6e4ed',
    borderStyle: 'solid',
    overflow: 'auto',
    maxHeight: '300px',
    boxShadow: 'none',
    borderRadius: 0,
    marginTop: 0,
  },
  message: {
    fontSize: 14,
    lineHeight: '14px',
    color: theme.palette.secondary.light,
    margin: theme.spacing(0, 2, 2, 2),
    '& ul': {
      paddingLeft: theme.spacing(2),
      fontStyle: 'italic',
      lineHeight: 1,
      '& li+li': {
        marginTop: theme.spacing(2),
      },
    },
  },
  childTree: {
    '& .rc-tree-indent-unit': {
      width: '16px !important',
    },
    '& .rc-tree-indent-unit:before': {
      display: 'none',
    },
    '& .rc-tree-switcher-noop': {
      width: 0,
    },
    '& .rc-tree-treenode': {
      height: theme.spacing(4),
      cursor: 'pointer',
      paddingLeft: theme.spacing(2),
      alignItems: 'center',
    },
    '& .rc-tree-treenode-selected': {
      backgroundColor: theme.palette.background.paper2,
      borderLeft: `3px solid ${theme.palette.primary.main}`,
    },
    '& .rc-tree-treenode:hover': {
      backgroundColor: theme.palette.background.paper2,
    },
    '& .filter-node': {
      backgroundColor: theme.palette.secondary.lightest,
    },
    '& .rc-tree-node-content-wrapper': {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      paddingRight: theme.spacing(2),
    },
    '& .MuiIconButton-sizeSmall': {
      marginRight: 5,
    },
    '& .MuiIconButton-label': {
      width: '12px',
      height: '12px',
    },
    '& .rc-tree-switcher,.rc-tree-draggable-icon': {
      margin: theme.spacing(0),
    },
  },
  treeTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    '& .MuiTypography-root': {
      fontStyle: 'italic',
      size: 14,
    },
  },
})
);

const TitleExtracts = React.memo(({fieldName, dataType}) => {
  const classes = useStyles();

  return (
    <div className={classes.treeTitle} >
      <span>{fieldName}</span>
      <Typography
        variant="body2" color="textSecondary" >
        {dataType}
      </Typography>
    </div>
  );
});

// this is the component rendered for each row inside extracts tree
export const TreeTitle = props => <TitleExtracts {...props} key={`title-${props.key}`} />;

// this component renders the whole extracts tree
// based on the sample data
const ExtractsTree = React.memo((
  {id,
    destDataType,
    propValue,
    inputValue = '',
    setInputValue,
    setIsFocused,
    onBlur,
    flowId,
    resourceId,
  }) => {
  const classes = useStyles();
  const isArrayType = destDataType.includes('array');
  const searchValues = useMemo(() => propValue.replaceAll('$.', '').split(','), [propValue]);
  const isGroupedSampleData = useSelector(state => selectors.mapping(state).isGroupedSampleData);

  const {treeData, selectedKeys} = useSelectorMemo(selectors.mkBuildExtractsTree, {flowId, resourceId, searchValues});
  const allKeys = useMemo(() => getAllKeys(treeData), [treeData]);

  const [expandedKeys, setExpandedKeys] = useState(allKeys);

  const onSelect = useCallback((keys, e) => {
    const newValue = getFinalSelectedExtracts(e.node, inputValue, isArrayType, isGroupedSampleData);

    setInputValue(newValue);
    setIsFocused(false);
    if (propValue !== newValue) { onBlur(newValue); }
    e.nativeEvent.stopImmediatePropagation();
  }, [inputValue, isArrayType, isGroupedSampleData, onBlur, propValue, setInputValue, setIsFocused]);

  const onExpand = useCallback((expandedKeys, {nativeEvent}) => {
    setIsFocused(true);
    setExpandedKeys(expandedKeys);
    nativeEvent.stopImmediatePropagation();
  }, [setIsFocused]);

  const filterTreeNode = useCallback(node => filterExtractsNode(node, propValue, inputValue), [inputValue, propValue]);

  if (isEmpty(treeData)) return null;

  return (
    <div
      onClick={e => e.stopPropagation()}
      className={classes.dropdown}>
      <div className={classes.message}>
        <Divider />
        <ul>
          <li>Type or select source record field</li>
          {isArrayType && <li>Separate additional fields with a comma (,)</li>}
        </ul>
        <Divider />
      </div>

      <Tree
        key={`extractsTree-${id}`}
        className={classes.childTree}
        selectedKeys={selectedKeys} // todo ashu verify this
        treeData={treeData}
        showLine={false}
        switcherIcon={SwitcherIcon}
        defaultExpandAll
        expandedKeys={expandedKeys}
        onSelect={onSelect}
        onExpand={onExpand}
        filterTreeNode={filterTreeNode}
         />
    </div>

  );
});

export default ExtractsTree;

