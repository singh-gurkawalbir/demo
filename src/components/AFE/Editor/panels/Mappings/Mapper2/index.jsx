/* eslint-disable no-restricted-syntax */
import React, {useCallback, useEffect, useRef} from 'react';
import Tree from 'rc-tree';
import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import ArrowUpIcon from '../../../../../icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import {SortableDragHandle} from '../../../../../Sortable/SortableHandle';
import {allowDrop, filterNode} from '../../../../../../utils/mapping';
import {selectors} from '../../../../../../reducers';
import Mapper2Row from './Mapper2Row';
import actions from '../../../../../../actions';
import useEnqueueSnackbar from '../../../../../../hooks/enqueueSnackbar';
import SearchBar from './SearchBar';

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
  const settingDrawerActive = useRef();
  const currentScrollPosition = useRef();

  useEffect(() => {
    if (isAutoCreateSuccess) {
      enqueueSnackbar({
        message: 'Destination fields successfully auto-populated.',
        variant: 'success',
      });
      dispatch(actions.mapping.v2.toggleAutoCreateFlag());
    }
    const handleWheelEvent = event => {
      if (event.deltaX) {
        event.preventDefault();
        const delta = Math.sign(event.deltaX);
        const scrollWidth = `${delta}2`;

        if (document.querySelector('.rc-tree-list-holder')) {
          document.querySelector('.rc-tree-list-holder').scrollLeft += scrollWidth;
        }
      }
    };

    document.addEventListener('wheel', handleWheelEvent, {passive: false});

    return () => window.removeEventListener('wheel', handleWheelEvent);
  }, [dispatch, enqueueSnackbar, isAutoCreateSuccess]);

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
  const settingDrawerHandler = () => {
    sessionStorage.setItem('scrollPosition', currentScrollPosition.current);
  };
  const Row = props => (
    <Mapper2Row
      {...props}
      key={`row-${props.key}`}
      nodeKey={props.key}
      settingDrawerHandler={settingDrawerHandler}
      settingDrawerActive={settingDrawerActive} />
  );
  const onExpandHandler = useCallback(expandedKeys => {
    dispatch(actions.mapping.v2.updateExpandedKeys(expandedKeys));
  }, [dispatch]);

  const onScrollHandler = e => {
    e.currentTarget.addEventListener('mousemove', event => {
      event.stopImmediatePropagation();
    }, true);
    if (settingDrawerActive.current && settingDrawerActive.current.wasActive) {
      const currentEle = e.currentTarget;

      setTimeout(() => {
        const scrollPos = sessionStorage.getItem('scrollPosition');

        currentEle.scrollTo(0, parseInt(scrollPos, 10));
        sessionStorage.removeItem('scrollPosition');
      }, 10);
      settingDrawerActive.current.wasActive = false;
    }
    currentScrollPosition.current = e.currentTarget.scrollTop;
  };

  return (
    <>
      {searchKey !== undefined && <SearchBar />}
      <div className={clsx(classes.mappingDrawerContent, {[classes.addSearchBar]: searchKey !== undefined})}>
        <Tree
          className={classes.treeRoot}
          height={600}
          itemHeight={20}
          titleRender={Row}
          treeData={treeData}
          showLine
          selectable={false}
          defaultExpandAll={false}
          expandedKeys={expandedKeys}
          defaultExpandParent={false}
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
