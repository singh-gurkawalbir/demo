import React, { useState, useRef, useCallback } from 'react';
import Tree from 'rc-tree';
import {isEmpty} from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, InputAdornment, Typography, Tooltip } from '@material-ui/core';
import isLoggableAttr from '../../../../../../utils/isLoggableAttr';
import {SwitcherIcon} from './index';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import useOnClickOutside from '../../../../../../hooks/useClickOutSide';
import useKeyboardShortcut from '../../../../../../hooks/useKeyboardShortcut';
import {selectors} from '../../../../../../reducers';
import {filterExtractsNode, getFinalSelectedExtracts} from '../../../../../../utils/mapping';
import { useSelectorMemo } from '../../../../../../hooks';

const useStyles = makeStyles(theme => ({
  customTextField: {
    padding: 0,
    display: 'flex',
    marginBottom: 0,
    '& > .MuiFilledInput-multiline': {
      minHeight: 38,
      padding: theme.spacing(1),
      '& >:nth-child(1)': {
        margin: 0,
        minWidth: 0,
        maxWidth: '85%',
        paddingTop: theme.spacing(0.5),
      },
      '& >:nth-child(2)': {
        minHeight: '16px !important',
        wordBreak: 'break-word',
      },
    },
    '& > div': {
      width: '100%',
    },
    '& > * .MuiFilledInput-input': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
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
  autoSuggestDropdown: {
    position: 'absolute',
    top: 4,
    right: 0,
    marginTop: '0px !important',
    color: theme.palette.secondary.light,
    pointerEvents: 'none',
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
  srcDataType: {
    fontStyle: 'italic',
    color: theme.palette.secondary.light,
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
})
);

// this is the component rendered for each row inside extracts tree
export const TitleExtracts = ({fieldName, dataType}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      '& .MuiTypography-root': {
        fontStyle: 'italic',
      },
    }} >
    <span>{fieldName}</span>
    <Typography
      variant="body2" color="textSecondary" style={{
        fontStyle: 'italic',
        size: 14,
      }}>{dataType}
    </Typography>
  </div>
);

// this component renders the whole extracts tree
// based on the sample data
const TreeExtracts = (
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
    onBlur(newValue);
    setIsFocused(false);
  }, [inputValue, isArrayType, onBlur, setInputValue, setIsFocused, setSrcDataType]);

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
};

export default function Mapper2ExtractsTypeableSelect(props) {
  const {
    dataType: destDataType = 'string',
    id,
    disabled,
    isLoggable,
    value: propValue = '',
    importId,
    flowId,
    onBlur,
  } = props;

  const classes = useStyles();
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(propValue);
  const [srcDataType, setSrcDataType] = useState('string');
  const containerRef = useRef();

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  const handleFocus = e => {
    e.stopPropagation();
    const { value } = e.target;

    e.target.setSelectionRange(value.length, value.length);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur(inputValue);
  };

  useOnClickOutside(containerRef, isFocused && handleBlur);
  useKeyboardShortcut(['Escape'], handleBlur, {ignoreBlacklist: true});

  // todo ashu only show tooltip when length is big
  // eslint-disable-next-line no-nested-ternary
  const toolTipTitle = isFocused ? '' : (!inputValue ? 'Source record field' : inputValue);

  return (
    <FormControl
      data-test={id}
      key={id}
      ref={containerRef}
      >
      <Tooltip disableFocusListener title={toolTipTitle} placement="bottom" >
        <TextField
          {...isLoggableAttr(isLoggable)}
          className={classes.customTextField}
          variant="filled"
          autoFocus={isFocused}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
          disabled={disabled}
          multiline={isFocused}
          placeholder="Source record field"
          InputProps={{
            endAdornment: (
              <InputAdornment className={classes.autoSuggestDropdown} position="start">
                <Typography variant="caption" className={classes.srcDataType}>{srcDataType}</Typography>
                <ArrowDownIcon />
              </InputAdornment>
            ),
          }}
   />
      </Tooltip >

      {/* only render tree component if its focussed and not disabled */}
      {isFocused && !disabled && (
      <TreeExtracts
        id={id}
        destDataType={destDataType}
        propValue={propValue}
        inputValue={inputValue}
        onBlur={onBlur}
        setInputValue={setInputValue}
        setIsFocused={setIsFocused}
        flowId={flowId}
        resourceId={importId}
        setSrcDataType={setSrcDataType} />
      )}

    </FormControl>
  );
}

