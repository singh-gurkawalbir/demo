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

const defaultMessages = [
  {
    role: 'system',
    content:
      "you are an assistant to build filter rules for celigo's integrator.io product. Do not output any explanations. Only output valid json.",
  },
  {
    role: 'user',
    content: 'only process records where type = adjustment',
  },
  {
    role: 'assistant',
    content:
      '{"rules":["equals",["string",["extract","Type"]],"Adjustment"],"version":"1"}',
  },
  {
    role: 'user',
    content: 'only process records where isDelete is true',
  },
  {
    role: 'assistant',
    content:
      '{"rules":["equals",["string",["extract","isDelete"]],"true"],"version":"1"}',
  },
  {
    role: 'user',
    content:
      'only process records where CreditMemoData.length > 0 and charge != yes',
  },
  {
    role: 'assistant',
    content:
      '{"rules":["and",["greaterthan",["number",["extract","CreditMemoData.length"]],0],["notequals",["string",["extract","CHARGE"]],"YES"]],"version":"1"}',
  },
];

const fieldMeta = editorClassName => ({
  fieldMap: {
    model: {
      id: 'model',
      name: 'model',
      label: 'model',
      type: 'text',
      defaultValue: 'gpt-3.5-turbo',
      readOnly: true,
    },
    temperature: {
      id: 'temperature',
      name: 'temperature',
      label: 'temperature',
      type: 'text',
      required: true,
      defaultValue: 0.2,
      helpText:
        'Between 0 and 2. Higher values like 0.8 will make the output more random, while lower values will make it more focused and deterministic. We recommend altering this or top_p but not both.',
    },
    topP: {
      id: 'top_p',
      name: 'top_p',
      label: 'top_p',
      type: 'text',
      defaultValue: 1,
      helpText:
        'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.',
    },
    maxTokens: {
      id: 'max_tokens',
      name: 'max_tokens',
      label: 'max_tokens',
      type: 'text',
      inputType: 'number',
      defaultValue: 512,
      helpText:
        'The maximum number of tokens to generate in the chat completion.  The total length of input tokens and generated tokens is limited by the model`s context length.',
    },
    messages: {
      id: 'messages',
      name: 'messages',
      label: 'messages',
      type: 'editor',
      mode: 'json',
      defaultValue: JSON.stringify(defaultMessages, null, 2),
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
  const formKey = `${editorId}-chatbot-settings`;

  const [prompt, setPrompt] = React.useState('remove records with age > 40');
  const [showSettings, setShowSettings] = React.useState(false);

  useFormInitWithPermissions({
    formKey,
    fieldMeta: fieldMeta(classes.openAIeditor),
  });

  const { status, errors } = useSelector(state =>
    selectors.editorAIState(state, editorId)
  );

  // console.log({ status, error, response });
  const disabled = useSelector(state =>
    selectors.isEditorDisabled(state, editorId)
  );

  const handleChange = e => {
    setPrompt(e.target.value);
  };

  const handleClick = () => {
    dispatch(actions.editor.AI.request(editorId, prompt));
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
