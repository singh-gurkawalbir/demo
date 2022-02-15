import React, { useState, useCallback } from 'react';
import Tree from 'rc-tree';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowUpIcon from '../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import {SortableDragHandle} from '../../../../components/Sortable/SortableHandle';
import {generateTreeFromMappings, allowDrop, findNode} from './util';
import MappingRow from './MappingRow';
import {TreeContextProvider} from './TreeContext';

const useStyles = makeStyles({
  root: {
    '& .rc-tree-indent-unit': {
      display: 'inline-block',
      width: 24,
    },
    '& .rc-tree-treenode': {
      display: 'flex',
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

  },
});

const SwitcherIcon = ({isLeaf, expanded}) => {
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
    key="newMappingRow"
           // index={emptyRowIndex}
    rowData={{...props}}
            // disabled={disabled}
              />
);

export default function Mapper2({importDoc}) {
  const classes = useStyles();
  const {mappings} = importDoc; // read from state
  const [treeData, setTreeData] = useState(generateTreeFromMappings(mappings));

  const onDropHandler = useCallback(info => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const {dropPosition} = info;

    const newTreeData = [...treeData];

    let dragObj;

    // Find dragObject and remove from current position
    findNode(newTreeData, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    // find drop position and insert dragged object
    findNode(newTreeData, dropKey, (item, index, arr) => {
      arr.splice(dropPosition, 0, dragObj);
    });

    setTreeData(newTreeData);
  }, [treeData]);

  return treeData.length
    ? (
      <TreeContextProvider treeData={treeData} setTreeData={setTreeData} >
        <Tree
          className={classes.root}
          titleRender={Row}
          treeData={treeData}
          // defaultExpandAll
          switcherIcon={SwitcherIcon}
          allowDrop={allowDrop}
          onDrop={onDropHandler}
          draggable={{
            icon: <SortableDragHandle isVisible />,
            nodeDraggable: node => !node.isTabNode,
          }}
        //   height={500}
        //   itemHeight={50}
        //   virtual={false}
             />
      </TreeContextProvider>
    )
    : 'Loading mappings';
}
