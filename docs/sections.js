module.exports.sections = [
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
      },
    ],
  },
  {
    name: 'UI Framework Docs',
    sections: [
      {
        name: 'Resource Management',
        content: 'docs/specs/resource.md',
      },
    ],
  },
];
