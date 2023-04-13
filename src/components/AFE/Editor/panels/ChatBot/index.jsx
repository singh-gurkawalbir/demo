import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import actions from '../../../../../actions';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { selectors } from '../../../../../reducers';
import { CHAT_STATUS } from '../../../../../reducers/session/editors';
import ActionButton from '../../../../ActionButton';
import DynaForm from '../../../../DynaForm';
import SettingsIcon from '../../../../icons/SettingsIcon';
import getFieldMeta from './getFieldMeta';
import ChatInput from './ChatInput';

const useStyles = makeStyles({
  openAIeditor: {
    height: 400,
  },
});

export default function ChatBotPanel({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [showSettings, setShowSettings] = React.useState(false);

  const { formKey, status, errors, request, placeholder } = useSelector(state =>
    selectors.editorChatState(state, editorId)
  );

  useFormInitWithPermissions({
    formKey,
    fieldMeta: getFieldMeta(request, classes.openAIeditor),
  });

  // console.log({ status, error, response });
  const disabled = useSelector(state =>
    selectors.isEditorDisabled(state, editorId)
  );

  const handleNewPrompt = prompt => {
    dispatch(actions.editor.chat.request(editorId, prompt));
  };

  const isPending = status === CHAT_STATUS.PENDING;

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        backgroundColor: errors ? '#FFF3F3' : 'white',
        border: errors ? '1px solid red' : 'none',
      }}
    >
      <div
        style={{
          padding: 8,
          height: '100%',
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
        }}
      >
        {!disabled && (
        <ChatInput
          key={editorId}
          isChatPending={isPending}
          placeholder={placeholder}
          onNewPrompt={handleNewPrompt}
          />
        )}
      </div>
      <div
        style={{
          display: 'flex',
          padding: 8,
          borderLeft: 'solid 1px lightGrey',
          width: showSettings ? '60%' : '41px',
          transition: 'width 0.3s ease-in',
        }}
      >
        {showSettings && (
          <div style={{ flexGrow: 1, overflowY: 'auto' }}>
            <DynaForm formKey={formKey} />
          </div>
        )}
        <div>
          <ActionButton
            disabled={isPending}
            onClick={() => setShowSettings(!showSettings)}
            style={{ marginLeft: 0 }}
          >
            <SettingsIcon />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
