import React, { useState } from 'react';
import Tree from 'rc-tree';
import { nanoid } from 'nanoid';
import isEmpty from 'lodash/isEmpty';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, TextField, InputAdornment, Typography } from '@material-ui/core';
import FieldMessage from '../../../../components/DynaForm/fields/FieldMessage';
import {getUnionObject} from '../../../../utils/jsonPaths';
import isLoggableAttr from '../../../../utils/isLoggableAttr';
import {SwitcherIcon} from './index';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import RawHtml from '../../../../components/RawHtml';
import {sampleData} from './util';

const useStyles = makeStyles(theme => ({
  dropdown: {
    backgroundColor: 'white',
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    top: '38px',
    borderWidth: '0px 1px 1px 1px',
    borderColor: '#d6e4ed',
    borderStyle: 'solid',
    overflow: 'scroll',
    maxHeight: '300px',
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
    margin: theme.spacing(1),
    // borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    '& ul': {
      paddingLeft: theme.spacing(2),
      fontStyle: 'italic',
      '& li+li': {
        marginTop: theme.spacing(2),
      },
    },
  },
  childTree: {
    paddingLeft: theme.spacing(1),
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
      height: theme.spacing(3),
    },
    '& .rc-tree-treenode.filter-node': {
      color: 'green',
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

const dataTypeMap = {
  '[object String]': 'string',
  '[object Number]': 'number',
  '[object Boolean]': 'boolean',
  '[object Null]': 'string',
};

const Title = ({fieldName, dataType}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      '& .MuiTypography-root': {
        fontStyle: 'italic',
      },
    }} >
    <span>{fieldName}</span>
    <Typography variant="body2" color="textSecondary">{dataType}</Typography>
  </div>
);

function iterate(dataIn, treeData, parentKey, parentFieldName = '') {
  Object.keys(dataIn).forEach(property => {
    if (property in dataIn) {
      const v = dataIn[property];
      const type = Object.prototype.toString.apply(v);

      if (type !== '[object Array]' && type !== '[object Object]') {
        treeData.push({
          key: nanoid(),
          parentKey,
          title: Title,
          fullPath: `${parentFieldName}.${property}`,
          fieldName: property,
          dataType: dataTypeMap[type],
        });

        return;
      }

      if (type === '[object Object]') {
        const key = nanoid();
        const children = [];

        treeData.push({
          key,
          parentKey,
          title: Title,
          fullPath: `${parentFieldName}.${property}`,
          fieldName: property,
          dataType: 'object',
          children,
        });

        iterate(v, children, key, `${parentFieldName}.${property}`);

        return;
      }

      if (type === '[object Array]') {
        if (Object.prototype.toString.apply(v[0]) === '[object Object]' && !isEmpty(v[0])) {
          const key = nanoid();
          const children = [];

          treeData.push({
            key,
            parentKey,
            title: Title,
            fullPath: `${parentFieldName}.${property}[*]`,
            fieldName: property,
            dataType: '[object]',
            children,
          });

          iterate(getUnionObject(v), children, key, `${parentFieldName}.${property}[*]`);

          return;
        }

        // primitive array
        const valueType = Object.prototype.toString.apply(v[0]);

        treeData.push({
          key: nanoid(),
          parentKey,
          title: Title,
          fullPath: `${parentFieldName}.${property}`,
          fieldName: property,
          dataType: `[${dataTypeMap[valueType]}]`,
        });
      }
    }
  });
}

const constructExtractsTree = dataIn => {
  const treeData = [];
  const children = [];

  if (!dataIn || typeof dataIn !== 'object') return treeData;

  const key = nanoid();

  treeData.push({
    key,
    title: '$',
    fullPath: '$',
    fieldName: '$',
    children,
  });

  iterate(dataIn, children, key, '$');
  // console.log('treeData', treeData);

  return treeData;
};

const treeData = constructExtractsTree(sampleData);

export default function MappingExtractsTypeableSelect(props) {
  const {
    disabled,
    id,
    value = '',
    isLoggable,
    dataType,
  } = props;
  const classes = useStyles();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const isArrayType = dataType.includes('array');

  const handleChange = event => {
    setInputValue(event.target.value);
  };

  const handleFocus = () => {
    setMenuIsOpen(true);
  };

  const handleBlur = () => {
    setMenuIsOpen(false);
  };

  const onSelect = (keys, e) => {
    if (isArrayType) {
      setInputValue((inputValue || '') + (e.node.fullPath || ''));
    } else {
      setInputValue(e.node.fullPath || '');
    }

    if (!isArrayType) {
      setMenuIsOpen(false);
    }
  };

  const mousedown = e => {
    e.preventDefault();
  };

  const filterTreeNode = treeNode => {
    const key = treeNode.fullPath || '';
    const splitInput = inputValue.split(';');

    const newT = splitInput.filter(i => {
      if (i && key && key.toUpperCase().indexOf(i.toUpperCase()) > -1) {
        return true;
      }

      return false;
    });

    if (isEmpty(newT)) return false;

    return true;
  };

  const dropdownText =
  isArrayType
    ? '<ul><li>Type or select source record field</li>   <li>Enter multiple separated by semicolons</li></ul>'
    : '<ul><li>Type or select source record field</li></ul>';

  return (
    <FormControl
      data-test={id}
      key={id}
      >
      <TextField
        {...isLoggableAttr(isLoggable)}
        variant="filled"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onClick={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        InputProps={{
          endAdornment: (<InputAdornment className={classes.autoSuggestDropdown} position="start"><ArrowDownIcon /></InputAdornment>),
        }}
           />

      {menuIsOpen && (
      <div
        onMouseDown={mousedown}
        className={classes.dropdown}
        >
        <div>
          <RawHtml className={classes.message} html={dropdownText} />
        </div>

        <Tree
          key={id}
          className={classes.childTree}
          treeData={treeData}
          showLine={false}
          switcherIcon={SwitcherIcon}
          defaultExpandAll
          onSelect={onSelect}
          filterTreeNode={filterTreeNode}
         />
      </div>

      )}
      <FieldMessage {...props} />
    </FormControl>
  );
}
