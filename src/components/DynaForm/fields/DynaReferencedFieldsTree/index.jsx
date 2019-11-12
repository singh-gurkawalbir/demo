import React, { Fragment, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Checkbox } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    height: 216,
    flexGrow: 1,
    maxWidth: 400,
  },
});

function RootNodes(props) {
  const { parentLabel = '', parentNodes, childNodes, Node } = props;

  return (
    <Fragment>
      {parentNodes.map(item => {
        const { label, value } = item;

        return (
          <TreeItem
            key={label}
            nodeId={`${parentLabel}/${value}`}
            label={label}>
            <Node {...item} />
          </TreeItem>
        );
      })}
      {childNodes && (
        <TreeItem>
          {childNodes.map(item => {
            const { label } = item;

            return (
              <RootNodes
                key={label}
                parent
                label={label}
                parentNodes={childNodes}
              />
            );
          })}
        </TreeItem>
      )}
    </Fragment>
  );
}

function TreeNavigation(props) {
  const classes = useStyles();
  const { Node } = props;
  const dispatch = useDispatch();
  const fetchFieldsAndReferencedFields = useCallback(
    (nodeId, expanded) => {
      if (expanded) dispatch(/* make call to get referenced fields */);
    },
    [dispatch]
  );

  return (
    <TreeView
      className={classes.root}
      onNodeToggle={fetchFieldsAndReferencedFields}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}>
      <RootNodes Node={Node} />
    </TreeView>
  );
}

export default function(props) {
  return <TreeNavigation {...props} Node={Checkbox} />;
}
