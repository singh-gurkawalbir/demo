import { Component } from 'react';
import { func, string } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CodePanel from '../panels/CodePanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';

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
        {error && (
          <PanelGridItem gridArea="error">
            <PanelTitle>
              <Typography color="error">Error</Typography>
            </PanelTitle>
            <CodePanel readOnly name="error" value={error} mode="json" />
          </PanelGridItem>
        )}
      </PanelGrid>
    );
  }
}
