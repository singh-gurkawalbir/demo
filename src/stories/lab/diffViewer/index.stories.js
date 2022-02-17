import React from 'react';
import DiffContent from './Diff';
import conflicts from './samples/conflicts.json';
import conflictsWithScript from './samples/conflictsWithScript.json';
import diff from './samples/diff.json';
import diffWithScript from './samples/diffWithScript.json';

export default {
  title: 'Lab/ Diff Viewer',
  component: DiffContent,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template = args => <DiffContent {...args} />;

export const JsonConflicts = Template.bind({});

JsonConflicts.args = {
  jsonDiff: conflicts,
};

export const ScriptConflicts = Template.bind({});

ScriptConflicts.args = {
  jsonDiff: conflictsWithScript,
};

export const JsonDiff = Template.bind({});

JsonDiff.args = {
  jsonDiff: diff,
};

export const DiffWithScripts = Template.bind({});

DiffWithScripts.args = {
  jsonDiff: diffWithScript,
};

