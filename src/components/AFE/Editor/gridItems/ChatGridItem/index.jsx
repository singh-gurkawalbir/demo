import React, {useCallback} from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { CHAT_STATUS } from '../../../../../reducers/session/editors';
import PanelGridItem from '../PanelGridItem';
import PanelTitle from '../PanelTitle';
import ChatBotPanel from '../../panels/ChatBot';
import ActionButton from '../../../../ActionButton';
import ThumbsUpIcon from '../../../../icons/ThumbsUpIcon';
import ThumbsDownIcon from '../../../../icons/ThumbsDownIcon';
import Help from '../../../../Help';
import Spinner from '../../../../Spinner';

const useStyles = makeStyles({
  flexContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  title: { flex: '0 0 auto' },
  panel: { flex: '1 1 100px', minHeight: 50, position: 'relative' },
  help: { padding: 0, marginLeft: 8 },
});

export default function ChatGridItem({ editorId, ref }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isPending = useSelector(
    state => selectors.editorChatState(state, editorId).status === CHAT_STATUS.PENDING
  );

  const handleFeedback = useCallback(wasHelpful => () => {
    dispatch(
      actions.app.postFeedback(
        'CeligoAI',
        `editor-${editorId}`,
        wasHelpful,
        // feedbackText
      )
    );
  }, [dispatch, editorId]);

  return (
    <PanelGridItem gridArea="chat" ref={ref}>
      <div className={classes.flexContainer}>
        <div className={classes.title}>
          <PanelTitle>
            <Typography variant="body1" component="div">
              Celigo AI
            </Typography>
            <Help
              className={classes.help}
              title="Celigo AI"
              helpText="Celigo AI is a natural language processing engine that uses machine learning
                    to understand the intent of your text. It can be used to automate your business processes
                    by providing a conversational interface to your applications."
            />
            <div style={{ marginLeft: 16 }}>
              {isPending && <Spinner size="small">Thinking</Spinner>}
            </div>
            <div style={{ flexGrow: 1 }} />
            <div style={{ marginTop: 4 }}>
              <ActionButton tooltip="Celigo AI was helpful">
                <ThumbsUpIcon onClick={handleFeedback(true)} />
              </ActionButton>

              <ActionButton tooltip="Celigo AI failed me">
                <ThumbsDownIcon onClick={handleFeedback(false)} />
              </ActionButton>
            </div>
          </PanelTitle>
        </div>
        <div className={classes.panel}>
          <ChatBotPanel editorId={editorId} />
        </div>
      </div>
    </PanelGridItem>
  );
}
