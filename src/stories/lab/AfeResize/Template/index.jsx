import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';

// import AfeProto from '../Prototype';
import actions from '../../../../actions';
import Editor from '../../../../components/AFE/Editor';

const editorId = 'storybook-afe';

const useStyles = makeStyles(() => ({
  content: {
    height: 'calc(100vh - 32px)',
  },
}));

export default function Template() {
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    dispatch(actions.editor.init(editorId, 'transform', {
      data: { id: 123, name: 'Bob', age: 33 },
      rule: [{ extract: 'id', generate: 'id' }],
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.content}>
      <Editor editorId={editorId} />
    </div>
  );
}
