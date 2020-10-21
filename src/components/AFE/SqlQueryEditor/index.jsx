import React, { useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { func, string } from 'prop-types';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import WarningGridItem from '../WarningGridItem';
import CodePanel from '../GenericEditor/CodePanel';
import SqlDataTabPanel from './SqlDataTabPanel';
import layouts from '../layout/defaultDialogLayout';
import PanelLoader from '../../PanelLoader';

const styles = layouts;
const Editor = props => {
  const {
    handleInit,
    classes,
    layout = 'compact',
    templateClassName,
    rule,
    ruleMode,
    dataMode,
    ruleTitle,
    sampleData,
    defaultData,
    result,
    resultMode,
    resultTitle,
    error,
    violations,
    handleRuleChange,
    handleDataChange,
    enableAutocomplete,
    showDefaultData,
    disabled,
    isSampleDataLoading,
    resultWarning,
  } = props;

  useEffect(() => {
    handleInit();
  }, [handleInit]);
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
          onChange={handleRuleChange}
          enableAutocomplete={enableAutocomplete}
          hasError={!!error}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="data" key={isSampleDataLoading}>
        {isSampleDataLoading ? (
          <PanelLoader />
        ) : (
          <SqlDataTabPanel
            processor="merge"
            showDefaultData={showDefaultData}
            sampleData={sampleData}
            defaultData={defaultData}
            dataMode={dataMode}
            handleChange={handleDataChange}
        />
        )}
      </PanelGridItem>

      <PanelGridItem gridArea="result">
        <PanelTitle title={resultTitle} />
        <CodePanel
          name="result" value={result} mode={resultMode} readOnly
          hasWarning={!!resultWarning} />
      </PanelGridItem>

      {/* Hide error/warning panel when sample data is loading */}
      {!isSampleDataLoading && (
        (error || violations)
          ? <ErrorGridItem error={error} violations={violations} />
          : <WarningGridItem warning={resultWarning} />
      ) }
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
