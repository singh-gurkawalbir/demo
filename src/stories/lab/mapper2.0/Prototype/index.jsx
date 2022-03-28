import React, { useState, useCallback } from 'react';
import Tree from 'rc-tree';
import cloneDeep from 'lodash/cloneDeep';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowUpIcon from '../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import {SortableDragHandle} from '../../../../components/Sortable/SortableHandle';
import {generateTreeFromMappings, allowDrop, findNode} from './util';
import MappingRow from './MappingRow';
import {TreeContextProvider} from './TreeContext';

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
    '& .rc-tree-treenode.drop-target': {
      backgroundColor: theme.palette.secondary.lightest,
    },
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
  <MappingRow
    key={props.key}
           // index={emptyRowIndex}
    rowData={{...props}}
            // disabled={disabled}
              />
);

const drag = {
  icon: <SortableDragHandle isVisible />,
  nodeDraggable: node => !node.isTabNode,
};

export default function Mapper2({importDoc}) {
  const classes = useStyles();
  const {mappings} = importDoc; // read from state
  const [treeData, setTreeData] = useState(generateTreeFromMappings(mappings));

  const onDropHandler = useCallback(info => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dragParentKey = info.dragNode.parentKey;
    const dropPos = info.node.pos.split('-');
    const dragPos = info.dragNode.pos.split('-');
    const dragNodeIndex = Number(dragPos[dragPos.length - 1]);
    const dropNodeIndex = Number(dropPos[dropPos.length - 1]);
    const dropPosition = info.dropPosition - dropNodeIndex;

    const newTreeData = cloneDeep(treeData);

    let dragObj;

    // Find dragObject and remove from current position
    findNode(newTreeData, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    let ar;
    let i;

    // find drop position and drop sub-array
    findNode(newTreeData, dropKey, (item, index, arr) => {
      ar = arr;
      i = index;
    });

    // child node is being dragged and dropped at top (0th index) of the children list
    if (dropPosition === 0 && dragParentKey === dropKey) {
      const hasTabbedRow = info.node.multipleSources;

      // if child is already at 0th position, nothing to do
      if (dragNodeIndex === 0 || (hasTabbedRow && dragNodeIndex === 1)) return;
      const {children = []} = ar[dropNodeIndex];

      // retain the tabbed row
      if (hasTabbedRow) {
        children.splice(1, 0, dragObj);
      } else {
        children.unshift(dragObj);
      }
    } else if (dropPosition === -1) { // drag obj inserted before drop node
      if (i === dragNodeIndex) return;

      ar.splice(i, 0, dragObj);
    } else { // drag obj inserted after drop node
      if (i + 1 === dragNodeIndex) return;

      ar.splice(i + 1, 0, dragObj);
    }

    setTreeData(newTreeData);
  }, [treeData]);

  // console.log('treeData', treeData);

  return treeData.length
    ? (
      <TreeContextProvider treeData={treeData} setTreeData={setTreeData} >
        <Tree
          className={classes.treeRoot}
          titleRender={Row}
          treeData={treeData}
          // defaultExpandAll
          showLine
          switcherIcon={SwitcherIcon}
          allowDrop={allowDrop}
          onDrop={onDropHandler}
          // activeKey={treeData[0].key}
          draggable={drag}
          // height={500}
        //   itemHeight={50}
        //   virtual={false}
              />
      </TreeContextProvider>
    )
    : 'Loading mappings';
}
