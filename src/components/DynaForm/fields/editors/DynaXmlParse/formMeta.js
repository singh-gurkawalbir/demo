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
        validWhen: {
          matchesRegEx: {
            pattern: '^/',
            message: "Resource path should start with '/'",
          },
        },
      },
      V0_json: {
        id: 'V0_json',
        name: 'V0_json',
        type: 'radiogroup',
        label: 'Parse strategy',
        helpKey: 'parser.xml.V0_json',
        defaultValue: options?.V0_json ? 'true' : 'false',
        options: [
          {
            items: [
              { value: 'false', label: 'Custom' },
              { value: 'true', label: 'Automatic' },
            ],
          },
        ],
      },
      trimSpaces: {
        id: 'trimSpaces',
        name: 'trimSpaces',
        type: 'checkbox',
        defaultValue: !!options?.trimSpaces,
        helpKey: 'parser.xml.trimSpaces',
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
        helpKey: 'parser.xml.listNodes',
        label: 'List nodes',
        visibleWhen,
      },
      includeNodes: {
        id: 'includeNodes',
        name: 'includeNodes',
        type: 'text',
        placeholder: 'all',
        defaultValue: options?.includeNodes || '',
        multiline: true,
        helpKey: 'parser.xml.includeNodes',
        label: 'Include only these nodes',
        visibleWhen,
      },
      excludeNodes: {
        id: 'excludeNodes',
        name: 'excludeNodes',
        type: 'text',
        placeholder: 'none',
        defaultValue: options?.excludeNodes || '',
        multiline: true,
        helpKey: 'parser.xml.excludeNodes',
        label: 'Exclude any of these nodes',
        visibleWhen,
      },
    },
  };
}
