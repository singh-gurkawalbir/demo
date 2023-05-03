import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tree from 'rc-tree';
import {isEmpty} from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Tooltip, Typography } from '@material-ui/core';
import {SwitcherIcon} from '../index';
import {selectors} from '../../../../../../../reducers';
import {getSelectedKeyInDestinationDropdown} from '../../../../../../../utils/mapping';
import actions from '../../../../../../../actions';

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
      width: 18,
      position: 'relative',
      height: '100%',
    },
    '& .childTree-treenode': {
      cursor: 'pointer',
      display: 'flex',
      position: 'relative',
      padding: theme.spacing(0.5, 0, 0.5, 2),
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
    '& .childTree-treenode-disabled': {
      '& .MuiTypography-root': {
        color: theme.palette.text.hint,
      },
    },
  },
  treeTitle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destinationDataType: {
    fontStyle: 'italic',
    size: 14,
    paddingLeft: theme.spacing(1),
  },
  treePropName: {
    fontStyle: 'italic',
    color: theme.palette.secondary.light,
  },
  destinationDropdownValue: {
    wordBreak: 'break-word',
  },
})
);

const TitleExtracts = ({generate, dataType, isRequired, disabled}) => {
  const classes = useStyles();

  return (
    <Tooltip
      title={disabled ? 'This field has already been mapped. A destination structure cannot have duplicate fields.' : ''}
      placement="bottom" >
      {/* this div needs to be added to render the tooltip correctly */}
      <div className={classes.treeTitle} >
        {isRequired
          ? <Typography variant="subtitle2" className={classes.destinationDropdownValue}><b>{generate} *</b> <span className={classes.treePropName}>(required)</span></Typography>
          : <Typography variant="subtitle2" className={classes.destinationDropdownValue}>{generate}</Typography>}
        <Typography
          variant="body2"
          color="textSecondary"
          className={classes.destinationDataType}>
          {dataType === 'objectarray' ? '[object]' : dataType}
        </Typography>
      </div>
    </Tooltip>
  );
};

// this is the component rendered for each row inside destination tree
const TreeTitle = props => {
  if (props.hidden) return null;

  return (
    <TitleExtracts {...props} key={`title-${props.key}`} />
  );
};

// this component renders the whole source fields tree
// based on the sample data
const DestinationTree = React.memo((
  {
    destDataType,
    propValue,
    setIsFocused,
  }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const destinationTreeData = useSelector(state => selectors.v2MappingsDestinationTree(state));

  // highlight selected keys, based on the saved generate and destDataType values
  const selectedKeys = useMemo(() => getSelectedKeyInDestinationDropdown(destinationTreeData[0], propValue, destDataType), [destDataType, destinationTreeData, propValue]);

  const onSelect = useCallback((keys, e) => {
    dispatch(actions.mapping.v2.addSelectedDestination(e.node.key));

    setIsFocused(false);
  }, [dispatch, setIsFocused]);

  if (isEmpty(destinationTreeData)) return null;

  return (
    <div className={classes.dropdown}>
      <ul className={classes.message}>
        <li>Type or select destination field</li>
      </ul>
      <Divider className={classes.messageDivider} />

      <Tree
        className={classes.childTree}
        prefixCls="childTree"
        titleRender={TreeTitle}
        multiple
        defaultSelectedKeys={selectedKeys}
        treeData={destinationTreeData}
        showLine={false}
        switcherIcon={SwitcherIcon}
        defaultExpandAll
        onSelect={onSelect}
      />
    </div>
  );
});

export default DestinationTree;

