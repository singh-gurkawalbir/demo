import React, {useCallback, useEffect, useState} from 'react';
import Tree from 'rc-tree';
import {isEqual} from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowUpIcon from '../../../../../icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import {SortableDragHandle} from '../../../../../Sortable/SortableHandle';
import {allowDrop} from '../../../../../../utils/mapping';
import SettingsDrawer from '../../../../../Mapping/Settings';
import {selectors} from '../../../../../../reducers';
import Mapper2Row from './Mapper2Row';
import actions from '../../../../../../actions';

const useStyles = makeStyles(theme => ({
  treeRoot: {
    '& .rc-tree-indent-unit': {
      display: 'inline-block',
      width: theme.spacing(9),
      position: 'relative',
      height: '100%',
    },
    '& .rc-tree-indent-unit:before': {
      position: 'absolute',
      top: '-8px',
      right: '30px',
      bottom: '8px',
      borderRight: '1px solid #d9d9d9',
      content: '""',
    },
    '& .rc-tree-treenode': {
      display: 'flex',
      position: 'relative',
      alignItems: 'center',
      '&:hover': {
        '& .rc-tree-draggable-icon': {
          visibility: 'visible',
        },
      },
    },
    '& .rc-tree-switcher-noop': {
      width: 30,
    },
    '& .rc-tree-draggable-icon': {
      visibility: 'hidden',
    },
    '& .rc-tree-node-content-wrapper': {
      // width: 500,
    },
    '& .rc-tree-treenode-active': {
      background: theme.palette.primary.light,
    },
    '& .MuiFilledInput-multiline': {
      paddingRight: theme.spacing(10),
    },
    '& .rc-tree-title': {
      '&>div>div': {
        width: 300,
      },
      '&>div>div:last-child': {
        width: 'auto',
      },
    },
    '& .MuiInputAdornment-root': {
      top: '50%',
      transform: 'translateY(-50%)',
    },
  },
  mappingDrawerContent: {
    height: '100%',
    display: 'flex',
    padding: theme.spacing(3, 3, 0),
    overflow: 'auto',
  },
})
);

export const SwitcherIcon = ({isLeaf, expanded}) => {
  if (isLeaf) {
    return null;
  }

  return expanded ? (
    <IconButton size="small">
      <ArrowUpIcon />
    </IconButton>
  ) : (
    <IconButton size="small">
      <ArrowDownIcon />
    </IconButton>
  );
};

const Row = props => (
  <Mapper2Row {...props} key={`row-${props.key}`} nodeKey={props.key} />
);
const dragConfig = {
  icon: <SortableDragHandle isVisible draggable />,
  nodeDraggable: node => (!node.isTabNode && !node.disabled),
};

export default function Mapper2({editorId}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [remountKey, setRemountKey] = useState(0);

  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const treeData = useSelector(state => selectors.v2MappingsTreeData(state), isEqual);

  const shouldExpandAll = useSelector(state => selectors.mapping(state)?.expandAll);
  const toggleCount = useSelector(state => selectors.mapping(state)?.toggleCount);

  const onDropHandler = useCallback(info => {
    dispatch(actions.mapping.v2.dropRow(info));
  }, [dispatch]);

  // this function ensures the row can be dragged via the drag handle only
  // and not from any other place
  const onDragStart = useCallback(({event}) => {
    if (event.target.id !== 'dragHandle') {
      event.preventDefault();
    }
    const parent = event.target.parentNode.parentNode;

    event.dataTransfer.setDragImage(parent, 0, 0);
  }, []);

  // we want the tree to re-render if expand/collapse flag is changed
  // defaultExpandAll prop of tree works only on mount hence re-mount is required
  useEffect(() => {
    setRemountKey(count => count + 1);
  }, [toggleCount]);

  return treeData.length
    ? (
      <>
        <SettingsDrawer disabled={disabled} />
        <div className={classes.mappingDrawerContent}>
          <Tree
            key={remountKey}
            className={classes.treeRoot}
           // expandedKeys={} set this when data type is change to auto expand
            titleRender={Row}
            treeData={treeData}
            showLine
            defaultExpandAll={shouldExpandAll}
            switcherIcon={SwitcherIcon}
            allowDrop={allowDrop}
            onDrop={onDropHandler}
          // activeKey={treeData[0].key}
            draggable={dragConfig}
            onDragStart={onDragStart}
            disabled={disabled}
          // height={500}
        //   itemHeight={50}
        //   virtual={false}
              />
        </div>
      </>

    )
    : 'Loading mappings';
}
