import { Component } from 'react';
import { func } from 'prop-types';
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
    handleInit: func.isRequired,
    handleRuleChange: func.isRequired,
    handleDataChange: func.isRequired,
    getEditor: func.isRequired,
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
      getEditor,
      ruleMode,
      ruleTitle,
      dataMode,
      dataTitle,
      resultMode,
      resultTitle,
      handleRuleChange,
      handleDataChange,
    } = this.props;
    const { rule, data, result, error } = getEditor();
    // favor custom template over pre-defined layouts.
    const gridTemplate = templateClassName || classes[`${layout}Template`];

    return (
      <PanelGrid className={gridTemplate}>
        <PanelGridItem gridArea="rule">
          <PanelTitle>{ruleTitle}</PanelTitle>
          <CodePanel
            name="rule"
            value={rule}
            mode={ruleMode}
            onChange={handleRuleChange}
          />
        </PanelGridItem>
        <PanelGridItem gridArea="data">
          <PanelTitle>{dataTitle}</PanelTitle>
          <CodePanel
            name="data"
            value={data}
            mode={dataMode}
            onChange={handleDataChange}
          />
        </PanelGridItem>
        <PanelGridItem gridArea="result">
          <PanelTitle>{resultTitle}</PanelTitle>
          <CodePanel
            name="result"
            value={result && result.data}
            mode={resultMode}
            readOnly
          />
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
