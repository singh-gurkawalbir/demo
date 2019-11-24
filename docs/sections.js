module.exports.sections = [
  {
    name: 'ColorPalette',
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
        name: 'HomePageCard',
        components: 'src/components/HomePageCard/**/*/index.jsx',
      },
      {
        name: 'Celigo Components',
        components: [
          'src/components/ArrowPopper/index.jsx',
          'src/components/ButtonGroup/index.jsx',
          'src/components/ErrorPanel/index.jsx',
          'src/components/Help/index.jsx',
          'src/components/HelpContent/index.jsx',
          'src/components/IconTextButton/index.jsx',
          'src/components/NotificationToaster/index.jsx',
          'src/components/Dynaform/fields/DynaSelectApplication/index.jsx',
          'src/components/Spinner/index.jsx',
          'src/components/TextToggle/index.jsx',
          'src/components/SwitchToggle/index.jsx',
          'src/components/MaskToken/index.jsx',
          'src/components/Status/index.jsx',
          'src/components/StatusCircle/index.jsx',
          'src/components/StatusTag/index.jsx',
          'src/components/Loader/index.jsx',
          'src/components/ActionButton/index.jsx',
        ],
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
