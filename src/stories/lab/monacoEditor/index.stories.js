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

// TODOs: Add stories for:
// 1. Altering theme colors. Not a deal breaker, but surely we would want some
//    control over the color palette for syntax highlighting.
// 2. Dynamically edit Monaco's internal model to support a user editing their sample data.
//    This is needed so the auto suggest matches the shape of the sample data.
