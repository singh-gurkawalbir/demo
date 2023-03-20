import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import Editor from '../../../../../components/AFE/Editor';
import ActionsRibbon from '../../../../../components/AFE/Drawer/ActionsRibbon';

const editorId = 'storybook-router';

const useStyles = makeStyles(theme => ({
  content: {
    height: 'calc(100vh - 80px)',
  },
  ribbon: {
    marginBottom: theme.spacing(2),
  },
}));

export default function Template() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const isReady = useSelector(state => !!selectors.editor(state, editorId).editorType);

  useEffect(() => {
    dispatch(actions.editor.init(editorId, 'router', {
      data: { id: 123, name: 'Bob', age: 33 },
      // rule: [{ extract: 'id', generate: 'id' }],
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log('isReady:', isReady);

  return (
    isReady ? (
      <>
        <ActionsRibbon editorId={editorId} className={classes.ribbon} />

        <div className={classes.content}>
          <Editor editorId={editorId} />
        </div>
      </>
    ) : (
      <Typography>Initializing editor.</Typography>
    )
  );
}
