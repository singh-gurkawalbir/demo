import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { func, string } from 'prop-types';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import CodePanel from '../GenericEditor/CodePanel';
import SqlDataTabPanel from './SqlDataTabPanel';

const styles = () => ({
  template: {
    gridTemplateColumns: '1fr 1fr',
    gridTemplateRows: '1fr 1fr 0fr',
    gridTemplateAreas: '"rule data" "result data" "error error"',
  },
});
const Editor = props => {
  const {
    handleInit,
    classes,
    rule,
    ruleMode,
    ruleTitle,
    sampleData,
    defaultData,
    result,
    resultMode,
    resultTitle,
    error,
    violations,
    handleRuleChange,
    handleDefaultDataChange,
    handleSampleDataChange,
    enableAutocomplete,
  } = props;

  useEffect(() => {
    handleInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PanelGrid className={classes.template}>
      <PanelGridItem gridArea="rule">
        <PanelTitle title={ruleTitle} />
        <CodePanel
          name="rule"
          value={rule}
          mode={ruleMode}
          onChange={handleRuleChange}
          enableAutocomplete={enableAutocomplete}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="data">
        <SqlDataTabPanel
          processor="merge"
          sampleData={sampleData}
          handleSampleDataChange={handleSampleDataChange}
          defaultData={defaultData}
          handleDefaultDataChange={handleDefaultDataChange}
        />
      </PanelGridItem>

      <PanelGridItem gridArea="result">
        <PanelTitle title={resultTitle} />
        <CodePanel name="result" value={result} mode={resultMode} readOnly />
      </PanelGridItem>

      <ErrorGridItem error={error} violations={violations} />
    </PanelGrid>
  );
};

Editor.propTypes = {
  rule: string,
  defaultData: string,
  sampleData: string,
  result: string,
  error: string,
  handleRuleChange: func.isRequired,
  handleSampleDataChange: func.isRequired,
  handleDefaultDataChange: func.isRequired,
};

export default withStyles(styles)(Editor);
