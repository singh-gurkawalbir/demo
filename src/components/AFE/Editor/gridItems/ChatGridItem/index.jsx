import React from 'react';
import { makeStyles } from '@material-ui/core';
import PanelGridItem from '../PanelGridItem';
import PanelTitle from '../PanelTitle';
import ChatBotPanel from '../../panels/ChatBot';

const useStyles = makeStyles({
  flexContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  title: { flex: '0 0 auto' },
  panel: { flex: '1 1 100px', minHeight: 50, position: 'relative' },
});

export default function ChatGridItem({ editorId, ref }) {
  const classes = useStyles();

  return (
    <PanelGridItem gridArea="chat" ref={ref}>
      <div className={classes.flexContainer}>
        <div className={classes.title}>
          <PanelTitle title="Celigo chat bot" />
        </div>
        <div className={classes.panel}>
          <ChatBotPanel editorId={editorId} />
        </div>
      </div>
    </PanelGridItem>
  );
}
