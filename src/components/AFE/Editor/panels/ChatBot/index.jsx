import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import actions from '../../../../../actions';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { selectors } from '../../../../../reducers';
import { CHAT_STATUS } from '../../../../../reducers/session/editors';
import ActionButton from '../../../../ActionButton';
import { FilledButton } from '../../../../Buttons';
import DynaForm from '../../../../DynaForm';
import SettingsIcon from '../../../../icons/SettingsIcon';
import Spinner from '../../../../Spinner';
import getFieldMeta from './getFieldMeta';

const useStyles = makeStyles({
  openAIeditor: {
    height: 400,
  },
});

export default function ChatBotPanel({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [prompt, setPrompt] = React.useState('');
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

  const handleChange = e => {
    setPrompt(e.target.value);
  };

  const handleClick = () => {
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
        <div style={{ flexGrow: 1 }}>
          <textarea
            value={prompt}
            disabled={disabled}
            onChange={handleChange}
            style={{
              width: '100%',
              height: '100%',
              resize: 'none',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
            }}
            placeholder={placeholder}
          />
        </div>

        <div style={{ display: 'flex', columnGap: 16, padding: 4 }}>
          <FilledButton onClick={handleClick} disabled={disabled || !prompt}>
            Submit
          </FilledButton>
          {isPending && <Spinner>Thinking...</Spinner>}
        </div>
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
