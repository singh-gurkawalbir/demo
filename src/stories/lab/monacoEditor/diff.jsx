import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {DiffEditor} from '@monaco-editor/react';

const useStyles = makeStyles({
  container: {
    height: '80vh',
    minHeight: '300px',
    overflow: 'hidden',
  },
});

const Template = args => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <DiffEditor
        height="100%"
        {...args} />
    </div>
  );
};

const original = `
// This is some sample code
const count = 10;
const data = {
  a: 123,
  b: true,
  c: 'some string',
  d: new Array(),
};
const list = ['dog', 'cat', 'pig'];

function add(a, b) {
    return a + b;
  }

for (let i=0; i<count; i++) {
  // do something!
  console.log(add(i, 5));
}
`;

const modified = `
// This is some sample code !!!
const count = 10;
const data = {
  a: 123,
  b: false,
  c: 'some longer string',
  d: new Array(),
};

function add(a, b) {
    return a + b;
  }

// new comment
for (let i=0; i<count; i++) {
  // Do something!
  console.log(add(i, 5));
}
`;

export const diffEditor = Template.bind({});

diffEditor.args = {
  original,
  modified,
};
