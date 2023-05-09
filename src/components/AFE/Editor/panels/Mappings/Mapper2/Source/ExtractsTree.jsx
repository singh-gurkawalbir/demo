import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Tree from 'rc-tree';
import {isEmpty} from 'lodash';
import makeStyles from '@mui/styles/makeStyles';
import { Divider, Typography } from '@mui/material';
import {SwitcherIcon} from '../index';
import {selectors} from '../../../../../../../reducers';
import {getFinalSelectedExtracts, getSelectedKeys} from '../../../../../../../utils/mapping';

const useStyles = makeStyles(theme => ({
  dropdown: {
    overflow: 'auto',
    maxHeight: theme.spacing(39),
  },
  message: {
    fontSize: 14,
    lineHeight: '14px',
    color: theme.palette.secondary.light,
    margin: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    fontStyle: 'italic',
    '& li+li': {
      marginTop: theme.spacing(2),
    },
  },
  messageDivider: {
    margin: theme.spacing(1, 2),
  },
  childTree: {
    paddingBottom: theme.spacing(1),
    '& .childTree-indent': {
      display: 'flex',
    },
    '& .childTree-indent-unit': {
      width: theme.spacing(1.5),
      position: 'relative',
      height: '100%',
    },
    '& .childTree-treenode': {
      cursor: 'pointer',
      display: 'flex',
      position: 'relative',
      padding: theme.spacing(1, 0, 1, 2),
      alignItems: 'center',
      borderLeft: '3px solid transparent',
      '&.hideRow': {
        display: 'none',
      },
    },
    '& .childTree-switcher': {
      width: theme.spacing(1),
    },
    '& .childTree-switcher-noop': {
      width: theme.spacing(1),
    },
    '& .childTree-treenode-selected,& .childTree-treenode:hover': {
      backgroundColor: theme.palette.background.paper2,
      borderColor: theme.palette.primary.main,
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
const TreeTitle = props => {
  if (props.hidden) return null;

  return (
    <TitleExtracts {...props} key={`title-${props.key}`} />
  );
};

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
    patchField,
    cursorPosition,
  }) => {
  const classes = useStyles();
  const isArrayType = destDataType.includes('array');
  const isGroupedSampleData = useSelector(state => selectors.mapping(state).isGroupedSampleData);
  const mappingsTreeData = useSelector(state => selectors.v2MappingsTreeData(state));
  const extractsTreeData = useSelector(state => selectors.v2MappingsExtractsTree(state));

  // highlight selected keys, based on the saved extract values
  const selectedKeys = useMemo(() => {
    // replace '$.' and '$[*].' as we are not storing these prefixes in each node jsonPath as well
    // for better searching
    const selectedValues = propValue.replace(/(\$\.)|(\$\[\*\]\.)/g, '').split(',');

    // pass the first index of tree as the tree length is always 1 because the parent is either $ or $[*]
    return getSelectedKeys(extractsTreeData[0], selectedValues);
  }, [extractsTreeData, propValue]);

  const onSelect = useCallback((keys, e) => {
    const newValue = getFinalSelectedExtracts(e.node, inputValue, isArrayType, isGroupedSampleData, nodeKey, mappingsTreeData, cursorPosition);

    setInputValue(newValue);
    setIsFocused(false);
    patchField(propValue, newValue, e.node?.jsonPath);
  }, [inputValue, isArrayType, isGroupedSampleData, nodeKey, mappingsTreeData, cursorPosition, setInputValue, setIsFocused, patchField, propValue]);

  if (isEmpty(extractsTreeData)) return null;

  return (
    <div className={classes.dropdown}>
      <ul className={classes.message}>
        <li>Type or select source field</li>
        {isArrayType &&
        (
        <><li> Separate fields with a comma (,)</li>
          <li>For sources that are not listed below, enter data types in Settings</li>
        </>
        )}
      </ul>
      <Divider className={classes.messageDivider} />

      <Tree
        className={classes.childTree}
        prefixCls="childTree"
        titleRender={TreeTitle}
        multiple
        defaultSelectedKeys={selectedKeys}
        treeData={extractsTreeData}
        showLine={false}
        switcherIcon={SwitcherIcon}
        defaultExpandAll
        onSelect={onSelect}
         />
    </div>
  );
});

export default ExtractsTree;

