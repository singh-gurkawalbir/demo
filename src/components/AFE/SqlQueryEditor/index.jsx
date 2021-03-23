import React, { useEffect } from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { func, string } from 'prop-types';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import WarningGridItem from '../WarningGridItem';
import CodePanel from '../GenericEditor/CodePanel';
import SqlRuleTabPanel from './SqlRuleTabPanel';
import layouts from '../layout/defaultDialogLayout';
import Spinner from '../../Spinner';

const useStyles = makeStyles(layouts);
const Editor = props => {
  const {
    handleInit,
    layout = 'compact',
    templateClassName,
    rule,
    ruleMode,
    dataMode,
    ruleTitle,
    dataTitle,
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
  const classes = useStyles();

  useEffect(() => {
    handleInit();
  }, [handleInit]);
  // favor custom template over pre-defined layouts.
  const gridTemplate = templateClassName || classes[`${layout}Template`];

  return (
    <PanelGrid className={gridTemplate}>
      <PanelGridItem gridArea="rule">
        <SqlRuleTabPanel
          showDefaultData={showDefaultData}
          rule={rule}
          defaultData={defaultData}
          ruleMode={ruleMode}
          handleRuleChange={handleRuleChange}
          enableAutocomplete={enableAutocomplete}
          error={error}
          ruleTitle={ruleTitle}
          dataMode={dataMode}
          handleDataChange={handleDataChange}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="data" key={isSampleDataLoading}>
        <PanelTitle title={dataTitle} />
        {isSampleDataLoading ? (
          <Spinner />
        ) : (
          <CodePanel
            name="sampleData"
            value={sampleData}
            mode={dataMode}
            readOnly={disabled}
            onChange={data => {
              handleDataChange('sampleData', data);
            }}
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
