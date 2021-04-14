import RulePanel from '../Editor/panels/Rule';
import ReadmePanel from '../Editor/panels/Readme';

export default {
  type: 'readme',
  label: 'Edit readme',
  panels: [
    {
      title: 'Data',
      area: 'rule',
      Panel: RulePanel,
      props: {
        attrName: 'readme',
        mode: 'html',
      },
    },
    {
      title: 'Preview',
      area: 'result',
      Panel: ReadmePanel,
    },
  ],
};
