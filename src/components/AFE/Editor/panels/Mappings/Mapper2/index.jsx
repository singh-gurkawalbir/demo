/* eslint-disable no-restricted-syntax */
import React, {useCallback, useEffect, useMemo, useRef } from 'react';
import Tree from 'rc-tree';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ArrowUpIcon from '../../../../../icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import {SortableDragHandle} from '../../../../../Sortable/SortableHandle';
import {allowDrop, filterNode, getAllKeys} from '../../../../../../utils/mapping';
import {selectors} from '../../../../../../reducers';
import Mapper2Row from './Mapper2Row';
import actions from '../../../../../../actions';
import useEnqueueSnackbar from '../../../../../../hooks/enqueueSnackbar';
import SearchBar from './SearchBar';
import { getMappingsEditorId } from '../../../../../../utils/editor';

const useStyles = makeStyles(theme => ({
  treeRoot: {
    flex: 1,
    '& .rc-tree-list': {
      minHeight: '100%',
      display: 'flex',
    },
    '& .rc-tree-indent-unit': {
      display: 'inline-block',
      width: theme.spacing(5),
      position: 'relative',
      height: '100%',
    },
    '& .rc-tree-indent-unit:before': {
      position: 'absolute',
      top: '-9px',
      right: theme.spacing(1),
      bottom: '7px',
      borderRight: `1px solid ${theme.palette.secondary.contrastText}`,
      content: '""',
    },
    '& .rc-tree-treenode': {
      display: 'flex',
      position: 'relative',
      border: '1px solid transparent',
      '&.hideRow': {
        display: 'none',
      },
      '&:hover': {
        '& .rc-tree-draggable-icon': {
          visibility: 'visible',
        },
      },
      '&.drag-over-gap-bottom,&.drag-over-gap-top,&.drag-over': {
        '& .rc-tree-node-content-wrapper': {
          '&>div': {
            backgroundColor: `${theme.palette.primary.main}!important`,
          },
        },
      },
      '&[draggable="false"]': {
        '& .rc-tree-node-content-wrapper': {
          flex: 1,
        },
        '&:hover': {
          '& .rc-tree-draggable-icon': {
            visibility: 'hidden',
          },
        },
      },
    },
    '& .filter-node': {
      '& .rc-tree-title>div>div:first-child>.MuiFormControl-root': {
        borderColor: theme.palette.primary.lightest,
      },
    },
    '& .rc-tree-switcher,.rc-tree-draggable-icon': {
      alignSelf: 'center',
      margin: theme.spacing(1, 0),
    },
    '& .rc-tree-switcher': {
      '&>.MuiIconButton-root': {
        padding: 0,
      },
    },
    '& .rc-tree-switcher-noop': {
      width: theme.spacing(3),
    },
    '& .rc-tree-draggable-icon': {
      '&>div': {
        paddingTop: 0,
        minWidth: theme.spacing(2.5),
        width: theme.spacing(2.5),
      },
      visibility: 'hidden',
    },
    '& .rc-tree-node-content-wrapper': {
      flex: 1,
    },
    '& .rc-tree-treenode-active': {
      backgroundColor: theme.palette.primary.lightest,
      borderLeft: `3px solid ${theme.palette.primary.main}`,
    },
    '& .MuiFilledInput-multiline': {
      padding: '6px 15px',
    },
    '& .MuiInputAdornment-root': {
      top: '50%',
      transform: 'translateY(-50%)',
    },
    '& .rc-tree-list-holder': {
      flexWrap: 'nowrap',
      display: 'flex',
      minHeight: '100%',
      '&>div': {
        flex: '0 0 auto',
      },
    },
  },
  virtualTree: {
    '& .rc-tree-list-holder': {
      flexWrap: 'nowrap',
      display: 'flex',
      minHeight: '100%',
      maxWidth: '1050px',
      width: '1050px',
      '&>div': {
        flex: '0 0 auto',
        width: '100%',
        overflow: 'visible!important',
        whiteSpace: 'nowrap',
      },
    },
  },
  virtualTreeCompactRow: {
    '& .rc-tree-list-holder': {
      flexWrap: 'nowrap',
      display: 'flex',
      minHeight: '100%',
      maxWidth: '1400px',
      width: '1400px',
      '&>div': {
        flex: '0 0 auto',
        width: '100%',
        overflow: 'visible!important',
        whiteSpace: 'nowrap',
      },
    },
  },
  mappingDrawerContent: {
    height: '100%',
    display: 'flex',
    paddingTop: theme.spacing(3),
    overflow: 'auto',
  },
  addSearchBar: {
    paddingTop: theme.spacing(6),
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
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const treeData = useSelector(state => selectors.v2MappingsTreeData(state));
  const isAutoCreateSuccess = useSelector(state => selectors.mapping(state).autoCreated);
  const expandedKeys = useSelector(state => selectors.v2MappingExpandedKeys(state));
  const activeKey = useSelector(state => selectors.v2ActiveKey(state));
  const searchKey = useSelector(state => selectors.searchKey(state));
  const importId = useSelector(state => selectors.mapping(state).importId);
  const editorLayout = useSelector(state => selectors.editorLayout(state, getMappingsEditorId(importId)));// editorlayout is required for adjusting horizontal scroll in both layouts
  const settingDrawerActive = useRef();
  const currentScrollPosition = useRef();

  // using memo here since getAllKeys will be expensive if the number of nodes increases
  const allNodes = useMemo(() => getAllKeys(treeData).length, [treeData]);

  // rc-tree does not support horizontal scroll hence
  // handling horizontal scroll if number of child nodes are more
  const handleWheelEvent = useCallback(event => {
    if (event.deltaX) {
      event.preventDefault();
      const delta = Math.sign(event.deltaX);
      const scrollWidth = `${delta}2`;

      if (document.querySelector('.rc-tree-list-holder')) {
        document.querySelector('.rc-tree-list-holder').scrollLeft += scrollWidth;
      }
    }
  }, []);
  // when virtualization is enabled we are stopping the event propagation created due rc-virtual-list
  const handleMouseMove = useCallback(event => {
    event.stopImmediatePropagation();
  }, []);

  useEffect(() => {
    if (isAutoCreateSuccess) {
      enqueueSnackbar({
        message: 'Destination fields successfully auto-populated.',
        variant: 'success',
      });
      dispatch(actions.mapping.v2.toggleAutoCreateFlag());
    }

    return () => {
      document.removeEventListener('wheel', handleWheelEvent);
      window.removeEventListener('mousemove', handleMouseMove, true);
    };
  }, [dispatch, enqueueSnackbar, handleMouseMove, handleWheelEvent, isAutoCreateSuccess]);

  // Add virtualization dynamically based on nodes added by user
  useEffect(() => {
    if (allNodes <= 50) {
      document.removeEventListener('wheel', handleWheelEvent);
      window.removeEventListener('mousemove', handleMouseMove, true);
    }
  }, [allNodes, handleMouseMove, handleWheelEvent]);

  // based on activekey we are tracking the cursor position when drawer is opened
  useEffect(() => {
    if (activeKey) {
      localStorage.setItem('scrollPosition', currentScrollPosition.current);
      settingDrawerActive.current = { wasActive: activeKey };
    }
  }, [activeKey]);

  const onDropHandler = useCallback(info => {
    dispatch(actions.mapping.v2.dropRow(info));
  }, [dispatch]);

  const filterTreeNode = useCallback(node => filterNode(node, searchKey), [searchKey]);

  // this function ensures the row can be dragged via the drag handle only
  // and not from any other place
  // this is a hack added as rc-tree module supports dragging from anywhere on row
  const onDragStart = useCallback(({event}) => {
    if (event.target.id !== 'dragHandle') {
      event.preventDefault();
    }
    const parent = event.target.parentNode.parentNode;

    event.dataTransfer.setDragImage(parent, 0, 0);
  }, []);

  const onExpandHandler = useCallback(expandedKeys => {
    dispatch(actions.mapping.v2.updateExpandedKeys(expandedKeys));
  }, [dispatch]);

  // Add scroll handling for navigating back to the user scroll previous scroll position
  // when virtaulization is enabled for rc-tree
  const onScrollHandler = useCallback(e => {
    // Add mouse move event listner to stop the default behaviour
    // of mouse move by rc-tree library
    window.addEventListener('mousemove', handleMouseMove, true);

    // Add wheel event listner to handle horizontal scroll
    document.addEventListener('wheel', handleWheelEvent, {passive: false});

    if (settingDrawerActive.current && settingDrawerActive.current.wasActive) {
      const currentEle = e.currentTarget;
      // NOTE: rc-tree by default is reseting the scroll to top postion when virtualization is enabled
      // inorder to set the user position back on close of drawer we are adding this time out for now
      // to handle this scenario.
      // TODO: There is be a slight delay in scroll animation when the scroll
      // is returning back to current position.this needs to be fixed

      setTimeout(() => {
        const scrollPos = localStorage.getItem('scrollPosition');

        currentEle.scrollTo(0, parseInt(scrollPos, 10));
        localStorage.removeItem('scrollPosition');
      }, 10);
      settingDrawerActive.current.wasActive = false;
    }
    currentScrollPosition.current = e.currentTarget.scrollTop;
  }, [handleMouseMove, handleWheelEvent]);

  return (
    <>
      {searchKey !== undefined && <SearchBar />}
      <div className={clsx(classes.mappingDrawerContent, {[classes.addSearchBar]: searchKey !== undefined})}>
        <Tree
          className={clsx(classes.treeRoot, {[classes.virtualTree]: allNodes > 50}, {[classes.virtualTreeCompactRow]: allNodes > 50 && editorLayout === 'compactRow'})}
          height={allNodes > 50 ? 600 : undefined}
          itemHeight={allNodes > 50 ? 20 : undefined}
          titleRender={Row}
          treeData={treeData}
          showLine
          selectable={false}
          expandedKeys={expandedKeys}
          onExpand={onExpandHandler}
          switcherIcon={SwitcherIcon}
          allowDrop={allowDrop}
          onDrop={onDropHandler}
          activeKey={activeKey}
          draggable={dragConfig}
          onDragStart={onDragStart}
          disabled={disabled}
          filterTreeNode={filterTreeNode}
          onScroll={onScrollHandler}
              />
      </div>
    </>
  );
}
