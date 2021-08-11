import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import TransformPanel from '../Editor/panels/Transform';

export default {
  // 1-1 with processor now, but this needs to change,
  // or we need introduced editor variants. maybe keyed from fieldId?
  type: 'transform',
  label: 'Transform editor',
  fieldId: 'transform',
  description: 'Transforms raw data to desired structure',
  panels: [
    {
      title: 'Rules',
      area: 'rule',
      Panel: TransformPanel,
    },
    {
      title: 'Input',
      area: 'data',
      Panel: DataPanel,
      props: {
        mode: 'json',
      },
    },
    {
      title: 'Output',
      area: 'result',
      Panel: ResultPanel,
      props: {
        mode: 'json',
      },
    },
  ],
};
