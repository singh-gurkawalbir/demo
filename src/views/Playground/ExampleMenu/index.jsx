import React from 'react';
import { makeStyles } from '@material-ui/core';
import { TreeView, TreeItem} from '@material-ui/lab';
import ArrowUpIcon from '../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import examples from '../examples';
import editors from '../editorMetadata';

const useStyles = makeStyles(theme => ({
  editorItem: {
    paddingTop: theme.spacing(1),
    '& > div > p': {
      fontWeight: 'bold',
    },
  },
}));

export default function ExampleMenu({ onClick }) {
  const classes = useStyles();

  // console.log(activeType, exampleKey, activeExample);

  return (
    <TreeView
      defaultCollapseIcon={<ArrowUpIcon />}
      defaultExpandIcon={<ArrowDownIcon />}
      >
      {editors.map(e => (
        <TreeItem className={classes.editorItem} nodeId={e.type} key={e.type} label={e.label}>
          {examples[e.type]?.map(e => (
            <TreeItem nodeId={e.key} key={e.key} label={e.name} onClick={() => onClick(e.type, e.key)} />
          ))}
        </TreeItem>
      ))}
    </TreeView>
  );
}
