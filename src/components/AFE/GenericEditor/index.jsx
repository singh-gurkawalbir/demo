import React, { useEffect } from 'react';
import { func, string } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CodePanel from './CodePanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import layouts from '../layout/defaultDialogLayout';
import PanelLoader from '../../PanelLoader';

const useStyles = makeStyles(() => ({
  ...layouts,
}));
const Editor = props => {
  const {
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
    handleInit,
    enableAutocomplete,
    disabled,
    isSampleDataLoading,
  } = props;
  const classes = useStyles();

  useEffect(() => {
    handleInit();
  }, [handleInit]);
  // favor custom template over pre-defined layouts.
  const gridTemplate = templateClassName || classes[`${layout}Template`];

  return (
    <PanelGrid className={gridTemplate} height="calc(100vh - 200px)">
      <PanelGridItem gridArea="rule">
        <PanelTitle title={ruleTitle} />
        <CodePanel
          name="rule"
          value={rule}
          mode={ruleMode}
          onChange={handleRuleChange}
          enableAutocomplete={enableAutocomplete}
          readOnly={disabled}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="data" key={isSampleDataLoading}>
        <PanelTitle title={dataTitle} />
        {/* show spinner instead of data panel when sample data is loading */}
        {isSampleDataLoading ? (
          <PanelLoader />
        ) : (
          <CodePanel
            name="data"
            value={data}
            mode={dataMode}
            onChange={handleDataChange}
            readOnly={disabled}
          />
        )}
      </PanelGridItem>
      <PanelGridItem gridArea="result">
        <PanelTitle title={resultTitle} />
        <CodePanel name="result" value={result} mode={resultMode} readOnly />
      </PanelGridItem>
      {/* Hide error panel when sample data is loading */}
      {!isSampleDataLoading && (
        <ErrorGridItem error={error} violations={violations} />
      )}
    </PanelGrid>
  );
};

Editor.propTypes = {
  rule: string,
  data: string,
  result: string,
  error: string,
  handleInit: func.isRequired,
  handleRuleChange: func.isRequired,
  handleDataChange: func.isRequired,
};

export default Editor;
