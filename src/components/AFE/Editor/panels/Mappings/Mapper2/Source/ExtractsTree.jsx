import React, { useCallback } from 'react';
import Tree from 'rc-tree';
import {isEmpty} from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import {SwitcherIcon} from '../index';
import {selectors} from '../../../../../../../reducers';
import {filterExtractsNode, getFinalSelectedExtracts} from '../../../../../../../utils/mapping';
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
    overflow: 'scroll',
    maxHeight: '300px',
    boxShadow: 'none',
    borderRadius: 0,
    marginTop: 0,
  },
  message: {
    fontSize: 14,
    lineHeight: '14px',
    color: theme.palette.secondary.light,
    margin: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
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

const TitleExtracts = ({fieldName, dataType}) => {
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
};

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
    setSrcDataType,
  }) => {
  const classes = useStyles();
  const isArrayType = destDataType.includes('array');

  const {treeData, selectedKeys} = useSelectorMemo(selectors.mkBuildExtractsTree, {flowId, resourceId, searchValues: propValue.replaceAll('$.', '').split(',')});

  const onSelect = useCallback((keys, e) => {
    const newValue = getFinalSelectedExtracts(e.node, inputValue, isArrayType);

    const splitByComma = inputValue.split(',');
    const valuesLen = splitByComma.length;

    // set source data type only if its a single value
    // todo ashu this should be handled for lookup, handlebar, hard-coded values also
    if (valuesLen > 1) { setSrcDataType(''); } else { setSrcDataType(e.node.dataType); }

    setInputValue(newValue);
    setIsFocused(false);
    if (propValue !== newValue) { onBlur(newValue); }
    e.nativeEvent.stopImmediatePropagation();
  }, [propValue, inputValue, isArrayType, onBlur, setInputValue, setIsFocused, setSrcDataType]);

  const onExpand = useCallback((expandedKeys, {nativeEvent}) => {
    setIsFocused(true);
    nativeEvent.stopImmediatePropagation();
  }, [setIsFocused]);

  const filterTreeNode = useCallback(node => filterExtractsNode(node, propValue, inputValue), [inputValue, propValue]);

  if (isEmpty(treeData)) return null;

  return (
    <div
      onClick={e => e.stopPropagation()}
      className={classes.dropdown}>
      <div className={classes.message}>
        <ul>
          <li>Type or select source record field</li>
          {isArrayType && <li>Separate additional fields with a comma (,)</li>}
        </ul>
      </div>

      <Tree
        key={id}
        className={classes.childTree}
        selectedKeys={selectedKeys} // todo ashu verify this
        treeData={treeData}
        showLine={false}
        switcherIcon={SwitcherIcon}
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        filterTreeNode={filterTreeNode}
         />
    </div>

  );
});

export default ExtractsTree;

