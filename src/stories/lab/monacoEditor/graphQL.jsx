import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Editor from '@monaco-editor/react';

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
      <Editor
        height="100%"
        {...args} />
    </div>
  );
};

const sample = `
query HeroComparison($first: Int = 3) {
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  friendsConnection(first: $first) {
    totalCount
    edges {
      node {
        name
      }
    }
  }
}

search(text: "an") {
    __typename
    ... on Human {
      name
    }
    ... on Droid {
      name
    }
    ... on Starship {
      name
    }
  }
  `;

export const graphQlEditor = Template.bind({});

graphQlEditor.args = {
  defaultLanguage: 'graphql',
  defaultValue: sample,
};
