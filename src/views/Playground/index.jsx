import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
// import actions from '../../actions';
import CeligoPageBar from '../../components/CeligoPageBar';
import examples from './examples';
import editors from './editorMetadata';
import Editor from '../../components/AFE2/Editor';
import EditorPreviewButton from '../../components/AFE2/EditorPreviewButton';
import EditorMenu from './EditorMenu';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: `calc(100% - ${theme.pageBarHeight + theme.appBarHeight}px)`,
  },
  editorList: {
    width: 250,
    padding: theme.spacing(3),
    border: `solid 0 ${theme.palette.secondary.lightest}`,
    borderRightWidth: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    flexGrow: 1,
  },
  title: {
    paddingBottom: theme.spacing(1),
  },
  buttons: {
    alignSelf: 'flex-end',
  },
}));
const editorId = 'playground';

export default function Editors() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [activeType, setActiveType] = useState();
  const [exampleKey, setExampleKey] = useState();
  const activeEditor = editors.find(e => e.type === activeType);
  const activeExample = examples[activeType]?.find(e => e.key === exampleKey);

  const handleMenuClick = (type, exampleKey) => {
    setActiveType(type);
    setExampleKey(exampleKey);

    // eslint-disable-next-line no-console
    console.log(type, exampleKey);
  };

  // console.log(activeType, exampleKey, activeExample);
  useEffect(() => {
    // dispatch(actions.editor.init({
    //   editorId,
    //   rule: activeExample.rule,
    //   data: activeExample.data,
    //   processor: activeExample.type,
    //   type: [http, url, dataUri] do we need this?
    //   // whatever other props are needed. Note if the data is supplied,
    //   // no need to pass props which are used to obtain sample data.
    // }));
    // every time a user selects a new example, we run this effect to
    // reset the initial state of the editor.
  }, [activeExample, dispatch]);

  return (
    <>
      <CeligoPageBar title="Developer playground" />
      <div className={classes.root}>
        <div className={classes.editorList}>
          <Typography variant="h4">Available Editors</Typography>
          <EditorMenu onClick={handleMenuClick} />
        </div>
        <main className={classes.content}>
          <div className={classes.title}>
            {activeEditor ? (
              <>
                <Typography variant="h4">{activeEditor.label} Editor</Typography>
                <Typography variant="h5">{activeExample.name}</Typography>
              </>
            ) : (
              <Typography>
                Get started by selecting an editor example on the left.
              </Typography>
            )}
          </div>

          {activeExample && (
            <>
              <Editor editorId={editorId} />
              <div className={classes.buttons}>
                <EditorPreviewButton editorId={editorId} />
              </div>
            </>
          )}

        </main>
      </div>
    </>
  );
}
