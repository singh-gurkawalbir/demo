import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Tree from 'rc-tree';
import {isEmpty} from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Typography } from '@material-ui/core';
import {SwitcherIcon} from '../index';
import {selectors} from '../../../../../../../reducers';
import {filterExtractsNode, getFinalSelectedExtracts} from '../../../../../../../utils/mapping';
import { useSelectorMemo } from '../../../../../../../hooks';

const useStyles = makeStyles(theme => ({
  dropdown: {
    overflow: 'auto',
    maxHeight: theme.spacing(39),
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
    paddingBottom: theme.spacing(1),
    '& .childTree-indent': {
      display: 'flex',
    },
    '& .childTree-indent-unit': {
      width: theme.spacing(1),
      position: 'relative',
      height: '100%',
    },
    '& .childTree-treenode': {
      cursor: 'pointer',
      display: 'flex',
      position: 'relative',
      padding: theme.spacing(1, 0, 1, 2),
      alignItems: 'center',
    },
    '& .childTree-switcher': {
      width: theme.spacing(1),
    },
    '& .childTree-switcher-noop': {
      width: theme.spacing(1),
    },
    '& .childTree-treenode-selected': {
      backgroundColor: theme.palette.background.paper2,
      borderLeft: `3px solid ${theme.palette.primary.main}`,
    },
    '& .childTree-treenode:hover': {
      backgroundColor: theme.palette.background.paper2,
    },
    '& .filter-node': {
      '& .childTree-title': {
        '& span': {
          backgroundColor: theme.palette.secondary.contrastText,
          lineHeight: 1,
        },
      },
    },
    '& .childTree-node-content-wrapper': {
      width: '100%',
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
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
    alignItems: 'center',
    '& .MuiTypography-root': {
      fontStyle: 'italic',
      size: 14,
      paddingLeft: theme.spacing(1),
    },
  },
  treePropName: {
    wordBreak: 'break-all',
  },
})
);

const TitleExtracts = ({propName, dataType}) => {
  const classes = useStyles();

  return (
    <div className={classes.treeTitle} >
      <span className={classes.treePropName}>{propName}</span>
      <Typography
        variant="body2" color="textSecondary" >
        {dataType}
      </Typography>
    </div>
  );
};

// this is the component rendered for each row inside extracts tree
const TreeTitle = props => <TitleExtracts {...props} key={`title-${props.key}`} />;

// this component renders the whole source fields tree
// based on the sample data
const ExtractsTree = React.memo((
  {
    nodeKey,
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
  const isGroupedSampleData = useSelector(state => selectors.mapping(state).isGroupedSampleData);
  const mappingsTreeData = useSelector(state => selectors.v2MappingsTreeData(state));

  // replace '$.' and '$[*].' as we are not storing these prefixes in each node jsonPath as well
  // for better searching
  // note: if we move this below split logic in the selector directly,
  // then we need to ensure that this returns a cached array else mkBuildExtractsTree will always run
  const selectedValues = useMemo(() => propValue.replace(/(\$\.)|(\$\[\*\]\.)/g, '').split(','), [propValue]);

  // build the tree and highlight selected keys, based on the saved extract values
  const {treeData, selectedKeys} = useSelectorMemo(selectors.mkBuildExtractsTree, {flowId, resourceId, selectedValues});

  const isArrayType = destDataType.includes('array');

  const onSelect = useCallback((keys, e) => {
    const newValue = getFinalSelectedExtracts(e.node, inputValue, isArrayType, isGroupedSampleData, nodeKey, mappingsTreeData);

    setInputValue(newValue);
    setIsFocused(false);
    if (propValue !== newValue) { onBlur(newValue); }
    e.nativeEvent.stopImmediatePropagation();
  }, [inputValue, isArrayType, isGroupedSampleData, onBlur, propValue, setInputValue, setIsFocused, nodeKey, mappingsTreeData]);

  const onExpand = useCallback((expandedKeys, {nativeEvent}) => {
    setIsFocused(true);
    nativeEvent.stopImmediatePropagation();
  }, [setIsFocused]);

  // this function runs for every node
  // and returns true if input value matches current node in the dropdown
  const filterTreeNode = useCallback(node =>
    filterExtractsNode(node, propValue, inputValue),
  [inputValue, propValue]);

  if (isEmpty(treeData)) return null;

  return (
    <div
      className={classes.dropdown}>
      <div className={classes.message}>
        <ul>
          <li>Type or select source record field</li>
          {isArrayType && <li>Separate additional fields with a comma (,)</li>}
        </ul>
        <Divider />
      </div>

      <Tree
        className={classes.childTree}
        prefixCls="childTree"
        titleRender={TreeTitle}
        multiple
        defaultSelectedKeys={selectedKeys}
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

