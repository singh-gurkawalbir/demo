import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import actions from '../../../../../actions';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import { selectors } from '../../../../../reducers';
import ActionButton from '../../../../ActionButton';
import { FilledButton } from '../../../../Buttons';
import DynaForm from '../../../../DynaForm';
import SettingsIcon from '../../../../icons/SettingsIcon';
import Spinner from '../../../../Spinner';

const fieldMeta = (chatOptions, editorClassName) => ({
  fieldMap: {
    model: {
      id: 'model',
      name: 'model',
      label: 'model',
      type: 'text',
      defaultValue: chatOptions.model,
      readOnly: true,
    },
    temperature: {
      id: 'temperature',
      name: 'temperature',
      label: 'temperature',
      type: 'text',
      required: true,
      defaultValue: chatOptions.temperature,
      helpText:
        'Between 0 and 2. Higher values like 0.8 will make the output more random, while lower values will make it more focused and deterministic. We recommend altering this or top_p but not both.',
    },
    topP: {
      id: 'top_p',
      name: 'top_p',
      label: 'top_p',
      type: 'text',
      defaultValue: chatOptions.top_p,
      helpText:
        'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.',
    },
    maxTokens: {
      id: 'max_tokens',
      name: 'max_tokens',
      label: 'max_tokens',
      type: 'text',
      inputType: 'number',
      defaultValue: chatOptions.max_tokens,
      helpText:
        'The maximum number of tokens to generate in the chat completion.  The total length of input tokens and generated tokens is limited by the model`s context length.',
    },
    messages: {
      id: 'messages',
      name: 'messages',
      label: 'messages',
      type: 'editor',
      mode: 'json',
      defaultValue: JSON.stringify(chatOptions.messages, null, 2),
      editorClassName,
    },
  },
});

const useStyles = makeStyles({
  openAIeditor: {
    height: 400,
  },
});

export default function ChatBotPanel({ editorId }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [prompt, setPrompt] = React.useState('include records with age > 40');
  const [showSettings, setShowSettings] = React.useState(false);

  const { formKey, status, errors, options } = useSelector(state =>
    selectors.editorChatState(state, editorId)
  );

  console.log('chat panel:', { editorId, formKey, status, errors, options });
  useFormInitWithPermissions({
    formKey,
    fieldMeta: fieldMeta(options, classes.openAIeditor),
  });

  // console.log({ status, error, response });
  const disabled = useSelector(state =>
    selectors.isEditorDisabled(state, editorId)
  );

  const handleChange = e => {
    setPrompt(e.target.value);
  };

  const handleClick = () => {
    dispatch(actions.editor.CHAT.request(editorId, prompt));
  };

  const isPending = status === 'pending';

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        backgroundColor: 'white',
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
            disabled={disabled}
            onChange={handleChange}
            style={{
              width: '100%',
              height: '100%',
              resize: 'none',
              border: 'none',
              outline: 'none',
            }}
            placeholder="Tell me what to filter"
          >
            {prompt}
          </textarea>
        </div>

        {status === 'failed' && (
        <div style={{ color: 'red' }}>{
          // eslint-disable-next-line react/no-array-index-key
          errors.map((error, i) => <div key={i}>{error}</div>)
        }
        </div>
        )}

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
