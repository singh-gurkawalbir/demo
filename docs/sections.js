module.exports.sections = [
  {
    name: 'Introduction',
    content: 'docs/introduction.md',
  },
  {
    name: 'Color Palette',
    content: 'docs/colors.md',
  },
  {
    name: 'Components',

    showUsage: true,
    skipComponentsWithoutExample: true,

    sections: [
      {
        name: 'Typography',
        content: 'docs/typography.md',
      },
      {
        name: 'Buttons',
        content: 'docs/buttons.md',
      },
      {
        name: 'Icons',
        components: [
          'src/components/icons/ResourceImg/index.jsx',
          'src/components/icons/ApplicationImg/index.jsx',
        ],
        sections: [
          {
            name: 'System',
            content: 'docs/icons/system.md',
          },
        ],
      },
      {
        name: 'Celigo Components',
        components: 'src/components/**/*/index.jsx',
        // editorConfig: { theme: 'material' },
      },
    ],
  },
];
