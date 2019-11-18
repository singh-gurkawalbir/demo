import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { func, string } from 'prop-types';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import CodePanel from '../GenericEditor/CodePanel';
import SqlDataTabPanel from './SqlDataTabPanel';
import layouts from '../layout/defaultDialogLayout';

const styles = layouts;
const Editor = props => {
  const {
    handleInit,
    classes,
    layout = 'compact',
    templateClassName,
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
    handleChange,
    enableAutocomplete,
    showDefaultData,
    disabled,
  } = props;

  useEffect(() => {
    handleInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // favor custom template over pre-defined layouts.
  const gridTemplate = templateClassName || classes[`${layout}Template`];

  return (
    <PanelGrid className={gridTemplate}>
      <PanelGridItem gridArea="rule">
        <PanelTitle title={ruleTitle} />
        <CodePanel
          name="rule"
          value={rule}
          readOnly={disabled}
          mode={ruleMode}
          onChange={data => {
            handleChange('template', data);
          }}
          enableAutocomplete={enableAutocomplete}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="data">
        <SqlDataTabPanel
          processor="merge"
          showDefaultData={showDefaultData}
          sampleData={sampleData}
          defaultData={defaultData}
          handleChange={handleChange}
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
  handleChange: func.isRequired,
};

export default withStyles(styles)(Editor);
