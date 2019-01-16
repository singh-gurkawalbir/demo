import { Component } from 'react';
import { func, string } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CodePanel from './CodePanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';

@withStyles(() => ({
  compactTemplate: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"rule data" "rule result" "error error"',
  },
  compact2Template: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"rule data" "result data" "error error"',
  },
  rowTemplate: {
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 1ft 1fr 0fr',
    gridTemplateAreas: '"rule" "data" "result" "error"',
  },
  columnTemplate: {
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '4fr 0fr',
    gridTemplateAreas: '"rule data result" "error error error"',
  },
}))
export default class Editor extends Component {
  static propTypes = {
    rule: string,
    data: string,
    result: string,
    error: string,
    handleInit: func.isRequired,
    handleRuleChange: func.isRequired,
    handleDataChange: func.isRequired,
  };

  componentDidMount() {
    const { handleInit } = this.props;

    handleInit();
  }

  render() {
    const {
      classes,
      helperFunctions,
      jsonHints,
      layout = 'compact',
      templateClassName,
      rule,
      ruleMode,
      ruleTitle,
      data,
      dataMode,
      dataTitle,
      result,
      resultMode,
      resultTitle,
      error,
      violations,
      handleRuleChange,
      handleDataChange,
    } = this.props;
    // favor custom template over pre-defined layouts.
    const gridTemplate = templateClassName || classes[`${layout}Template`];

    return (
      <PanelGrid className={gridTemplate}>
        <PanelGridItem gridArea="rule">
          <PanelTitle title={ruleTitle} />
          <CodePanel
            name="rule"
            value={rule}
            helperFunctions={helperFunctions}
            jsonHints={jsonHints}
            mode={ruleMode}
            onChange={handleRuleChange}
          />
        </PanelGridItem>
        <PanelGridItem gridArea="data">
          <PanelTitle title={dataTitle} />
          <CodePanel
            name="data"
            value={data}
            mode={dataMode}
            onChange={handleDataChange}
          />
        </PanelGridItem>
        <PanelGridItem gridArea="result">
          <PanelTitle title={resultTitle} />
          <CodePanel name="result" value={result} mode={resultMode} readOnly />
        </PanelGridItem>

        <ErrorGridItem error={error} violations={violations} />
      </PanelGrid>
    );
  }
}
