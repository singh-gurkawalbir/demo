import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { TreeView, TreeItem} from '@mui/lab';
import { uniqBy } from 'lodash';
import actions from '../../../actions';
import ArrowUpIcon from '../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import examples from '../examples';
import { editorList } from '../../../components/AFE/metadata';

const useStyles = makeStyles(theme => ({
  editorItem: {
    paddingTop: theme.spacing(1),
    '& > div > p': {
      fontWeight: 'bold',
    },
  },
}));

export default function ExampleMenu({ onEditorChange }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  const handleClick = ({key, type, rule, data }) => {
    dispatch(actions.editor.init(key, type, { rule, data }));
    onEditorChange(key);
  };

  const uniqueEditors = useMemo(() => uniqBy(editorList.filter(e => examples[e.type]?.length), 'type'), []);

  return (
    <TreeView
      defaultCollapseIcon={<ArrowUpIcon />}
      defaultExpandIcon={<ArrowDownIcon />}
    >
      {uniqueEditors.map(e => (
        <TreeItem className={classes.editorItem} nodeId={e.type} key={e.type} label={e.label}>
          {examples[e.type]?.map(e => (
            <TreeItem nodeId={e.key} key={e.key} label={e.name} onClick={() => handleClick(e)} />
          ))}
        </TreeItem>
      ))}
    </TreeView>
  );
}
