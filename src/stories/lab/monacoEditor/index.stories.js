// eslint-disable-next-line import/no-extraneous-dependencies
import { jsxDecorator } from 'storybook-addon-jsx';
import Editor from '@monaco-editor/react';
import { diffEditor } from './diff';
import { scriptEditor } from './script';
import { graphQlEditor } from './graphQL';

export default {
  title: 'Lab / Monaco Editor',
  component: Editor,
  decorators: [jsxDecorator],
};

export const DiffEditor = diffEditor;
export const ScriptEditor = scriptEditor;
export const GraphQlEditor = graphQlEditor;
