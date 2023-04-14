export default function getFieldMeta(request, editorClassName) {
  return {
    fieldMap: {
      model: {
        id: 'model',
        visible: false,
        name: 'model',
        label: 'model',
        type: 'text',
        defaultValue: request.model,
        readOnly: true,
      },
      temperature: {
        id: 'temperature',
        visible: false,
        name: 'temperature',
        label: 'temperature',
        type: 'text',
        required: true,
        defaultValue: request.temperature,
        helpText:
        'Between 0 and 2. Higher values like 0.8 will make the output more random, while lower values will make it more focused and deterministic. We recommend altering this or top_p but not both.',
      },
      topP: {
        id: 'top_p',
        visible: false,
        name: 'top_p',
        label: 'top_p',
        type: 'text',
        defaultValue: request.top_p,
        helpText:
        'An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.',
      },
      messages: {
        id: 'messages',
        name: 'messages',
        label: 'messages',
        type: 'editor',
        mode: 'json',
        defaultValue: JSON.stringify(request.messages, null, 2),
        editorClassName,
      },
      maxTokens: {
        id: 'max_tokens',
        name: 'max_tokens',
        label: 'max_tokens',
        type: 'text',
        inputType: 'number',
        defaultValue: request.max_tokens,
        helpText:
        'The maximum number of tokens to generate in the chat completion.  The total length of input tokens and generated tokens is limited by the model`s context length.',
      },
    },
  };
}
