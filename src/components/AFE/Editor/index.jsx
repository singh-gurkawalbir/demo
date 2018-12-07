import { Component } from 'react';
import { func, string } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CodePanel from '../panels/CodePanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';

@withStyles(theme => ({
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
  errorGridItem: {
    // height: '25%',
    marginBottom: theme.spacing.double,
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
      violations,
      handleRuleChange,
      handleDataChange,
    } = this.props;
    // favor custom template over pre-defined layouts.
    const gridTemplate = templateClassName || classes[`${layout}Template`];
    const errorText = [
      JSON.stringify(error),
      violations && violations.ruleError,
      violations && violations.dataError,
    ]
      .filter(e => !!e)
      .join('\n');

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
        {errorText && (
          <PanelGridItem className={classes.errorGridItem} gridArea="error">
            <PanelTitle>
              <Typography color="error">Error</Typography>
            </PanelTitle>
            <CodePanel
              readOnly
              overrides={{ wrap: true }}
              mode="text"
              name="error"
              value={errorText}
            />
          </PanelGridItem>
        )}
      </PanelGrid>
    );
  }
}
