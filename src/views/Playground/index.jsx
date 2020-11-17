import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, FormControl, makeStyles, MenuItem, Tooltip, Typography } from '@material-ui/core';
// import actions from '../../actions';
import CeligoPageBar from '../../components/CeligoPageBar';
import examples from './examples';
import editors from './editorMetadata';
import CeligoSelect from '../../components/CeligoSelect';
import Editor from '../../components/AFE2/Editor';
import EditorPreviewButton from '../../components/AFE2/EditorPreviewButton';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    height: `calc(100% - ${theme.pageBarHeight + theme.appBarHeight}px)`,
  },
  editorList: {
    width: 220,
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
  selectExample: {
    display: 'flex',
    justifyContent: 'space-between',
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

  const handleEditorClick = type => {
    setActiveType(type);
    setExampleKey(examples[type][0].key);
  };

  // console.log(activeType, exampleKey, activeExample);
  useEffect(() => {
    // dispatch(actions.editor.init({
    //   editorId,
    //   rule: activeExample.rule,
    //   data: activeExample.data,
    //   type: activeExample.type,
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
          {editors.map(e => (
            <div key={e.type}>
              <Tooltip title={e.description} placement="right">
                <Button selected onClick={() => handleEditorClick(e.type)}>{e.label}</Button>
              </Tooltip>
            </div>
          ))}
        </div>
        <main className={classes.content}>
          <div className={classes.selectExample}>
            <Typography variant="h4">{activeEditor?.label} Examples</Typography>
            {!activeEditor
              ? (
                <Typography>
                  Get started by selecting an editor on the left.
                </Typography>
              ) : (
                <FormControl>
                  <CeligoSelect
                    placeholder="Select example"
                    value={exampleKey}
                    onChange={e => setExampleKey(e.target.value)}>
                    {examples[activeType].map(e => (
                      <MenuItem key={e.key} value={e.key}>
                        {e.name}
                      </MenuItem>
                    ))}
                  </CeligoSelect>
                </FormControl>
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
