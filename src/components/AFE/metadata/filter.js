import DataPanel from '../Editor/panels/Data';
import ResultPanel from '../Editor/panels/Result';
import ChatBotPanel from '../Editor/panels/ChatBot';
import FilterPanel from '../Editor/panels/Filter';

export default {
  type: 'filter',
  label: 'Filter editor',
  fieldId: 'transform',
  description: 'Constructs filter rules against raw data',
  panels: options => {
    const { enableAI } = options;

    console.log('filter metadata', options);
    const panels = [
      {
        title: 'Rules',
        area: 'rule',
        isLoggable: true,
        Panel: FilterPanel,
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
          mode: 'text',
        },
      },
    ];

    if (enableAI) {
      panels.push({
        title: 'Celigo chat bot',
        area: 'chat',
        Panel: ChatBotPanel,
      });
    }

    return panels;
  },
  // sample metadata to support new features.
  drawer: {
    showLayoutToggle: true,
  },
};
