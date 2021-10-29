// we disable the linting rule below to allow for encoding of "snippet" format strings i the proposal JSON.
/* eslint-disable no-template-curly-in-string */

// Note that this function returns all possible suggestions. There is another function used to filter this
// list based on what a user is typing. The functionality is split in case a developer want to only override
// the suggestion list OR the filter function.
export function createProposals(monaco, range) {
  const proposals = [
    // For full details on what properties are available and how they work, visit the link below:
    // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.languages.completionitem.html
    // {
    // The label of this completion item. By default this is also the text that is inserted when selecting this completion.
    // label: '"abc"',

    // A string that should be used when filtering a set of completion items. When falsy the label is used.
    // filterText: 'abc',

    // A string that should be used when comparing this item with other items. When falsy the label is used.
    // sortText: 'abc',

    // The kind of this completion item. Based on the kind an icon is chosen by the editor.
    // kind: monaco.languages.CompletionItemKind.Snippet,

    // A human-readable string that represents a doc-comment.
    // documentation: 'This is from the documentation property',

    // A human-readable string with additional information about this item, like type or symbol information.
    // detail: 'This is from the detail property',

    // A string or snippet that should be inserted in a document when selecting this completion. is used.
    // insertText: '"${1:first-snipped-term}": "${2:second-snipped-term}"',

    // Addition rules (as bitmask) that should be applied when inserting this completion.
    // insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,

    // A range of text that should be replaced by this completion item.
    // range,
    // },

    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'abs',
      insertText: '{{abs ${1:field}}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'add',
      insertText: '{{add field field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'and',
      insertText: '{{#and field field}} expr {{else}} expr {{/and}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'avg',
      insertText: '{{avg field field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'base64Encode',
      insertText: '{{base64Encode field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'base64Decode',
      insertText: '{{base64Decode field decodeFormat}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'capitalize',
      insertText: '{{capitalize field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'capitalizeAll',
      insertText: '{{capitalizeAll field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'ceil',
      insertText: '{{ceil field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'compare',
      insertText: '{{#compare field  operator field}} expr {{else}} expr {{/compare}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'contains',
      insertText: '{{#contains collection field}} expr {{else}} expr {{/contains}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'dateAdd',
      insertText: '{{dateAdd dateField offsetField timeZoneField}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'dateFormat',
      insertText: '{{dateFormat o/pformat date i/pformat timezone}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'decodeURI',
      insertText: '{{decodeURI field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'divide',
      insertText: '{{divide field field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'each',
      insertText: '{{#each field}}{{this}}{{/each}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'encodeURI',
      insertText: '{{encodeURI field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'floor',
      insertText: '{{floor field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'getValue',
      insertText: '{{getValue field "defaultValue"}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'hash',
      insertText: '{{hash algorithm encoding field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'hmac',
      insertText: '{{hmac algorithm key encoding field keyEncoding}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'if_else',
      insertText: '{{#if field}} expr {{else}} expr {{/if}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'ifEven',
      insertText: '{{#ifEven field}} expr {{else}} expr {{/ifEven}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'join',
      insertText: '{{join delimiterField field1 field2}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'jsonEncode',
      insertText: '{{jsonEncode field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'jsonSerialize',
      insertText: '{{jsonSerialize field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'lookup',
      insertText: '{{lookup lookupName contextPath}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'lowercase',
      insertText: '{{lowercase field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'multiply',
      insertText: '{{multiply field field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'neither',
      insertText: '{{#neither field field}} expr {{else}} expr {{/neither}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'or',
      insertText: '{{#or field field}} expr {{else}} expr {{/or}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'random',
      insertText: '{{random "CRYPTO"/"UUID" length}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'regexMatch',
      insertText: '{{regexMatch field regex index options}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'regexReplace',
      insertText: '{{regexReplace field1 field2 regex options}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'regexSearch',
      insertText: '{{regexSearch field regex options}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'replace',
      insertText: '{{replace field string string}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'round',
      insertText: '{{round field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'sortnumbers',
      insertText: '{{sort field number="true"}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'sortstrings',
      insertText: '{{sort field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'split',
      insertText: '{{split field delimiter index}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'substring',
      insertText: '{{substring stringField startIndex endIndex}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'subtract',
      insertText: '{{subtract field field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'sum',
      insertText: '{{sum <array>}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'timestamp',
      insertText: '{{timestamp format timezone}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'toExponential',
      insertText: '{{toExponential field fractionDigits}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'toFixed',
      insertText: '{{toFixed field digits}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'toPrecision',
      insertText: '{{toPrecision field precision}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'trim',
      insertText: '{{trim field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'unless',
      insertText: '{{#unless field}} expr {{else}} expr {{/unless}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'uppercase',
      insertText: '{{uppercase field}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
    {
      kind: monaco.languages.CompletionItemKind.Snippet,
      label: 'with',
      insertText: '{{#with field}} {{field1}} {{field2}} {{/with}}',
      range,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    },
  ];

  proposals.forEach((p, i) => { proposals[i].filterText = `{{${p.label}`; });

  return proposals;
}

