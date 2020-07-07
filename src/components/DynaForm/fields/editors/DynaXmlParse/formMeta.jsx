/* eslint-disable camelcase */ // V0_json is a schema field. cant change.

const visibleWhen = [{ field: 'V0_json', is: ['false'] }];

export default function getForm(options) {
  return {
    fieldMap: {
      resourcePath: {
        id: 'resourcePath',
        name: 'resourcePath',
        label: 'Resource path',
        type: 'text',
        defaultValue: options?.resourcePath || '',
        required: true,
      },
      V0_json: {
        id: 'V0_json',
        name: 'V0_json',
        type: 'radiogroup',
        label: 'Parse strategy',
        helpText: `Automatic parsing means the XML data is converted to JSON without any user configurations.
        This typically generates a more complex and difficult to read JSON.
        If you would like to have more control over what the JSON output looks like,
        use the custom option.`,
        defaultValue: options?.V0_json ? 'true' : 'false',
        options: [
          {
            items: [
              { value: 'false', label: 'Custom' },
              { value: 'true', label: 'Automatic' },
            ]
          }
        ]
      },
      trimSpaces: {
        id: 'trimSpaces',
        name: 'trimSpaces',
        type: 'checkbox',
        defaultValue: !!options?.trimSpaces,
        helpText: 'If checked, values will be stripped of leading and trailing whitespace.',
        label: 'Trim leading and trailing spaces',
        visibleWhen,
      },
      stripNewLineChars: {
        id: 'stripNewLineChars',
        name: 'stripNewLineChars',
        type: 'checkbox',
        defaultValue: !!options?.stripNewLineChars,
        label: 'Strip new line characters',
        visibleWhen,
      },
      attributePrefix: {
        id: 'attributePrefix',
        name: 'attributePrefix',
        type: 'text',
        placeholder: 'none',
        defaultValue: options?.attributePrefix || '',
        label: 'Character to prepend on attribute names',
        visibleWhen,
      },
      textNodeName: {
        id: 'textNodeName',
        name: 'textNodeName',
        type: 'text',
        placeholder: '&txt',
        defaultValue: options?.textNodeName || '',
        label: 'Text node name',
        visibleWhen,
      },
      listNodes: {
        id: 'listNodes',
        name: 'listNodes',
        type: 'text',
        defaultValue: options?.listNodes || '',
        multiline: true,
        helpText: 'It is not always possible to infer which XML nodes are single values or a list. To force an XML node to be recognized as a list (Array), enter it\'s path here.',
        label: 'List nodes',
        visibleWhen
      },
      includeNodes: {
        id: 'includeNodes',
        name: 'includeNodes',
        type: 'text',
        placeholder: 'all',
        defaultValue: options?.includeNodes || '',
        multiline: true,
        helpText: 'Often XML documents are large and their full content is not needed. It is possibly to reduce the record size by specifying only the set of nodes (specified by path) that should be extracted.',
        label: 'Include only these nodes',
        visibleWhen
      },
      excludeNodes: {
        id: 'excludeNodes',
        name: 'excludeNodes',
        type: 'text',
        placeholder: 'none',
        defaultValue: options?.excludeNodes || '',
        multiline: true,
        helpText: 'It may be easier to specify node to exclude than which to include. If you wish to exclude certain xml nodes from the final record, specify them here using a simplified xpath.',
        label: 'Exclude any of these nodes',
        visibleWhen
      },
    }
  };
}
