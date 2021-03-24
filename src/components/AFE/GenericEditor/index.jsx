import React, { useEffect } from 'react';
import { func, string } from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CodePanel from './CodePanel';
import PanelGrid from '../PanelGrid';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import ErrorGridItem from '../ErrorGridItem';
import WarningGridItem from '../WarningGridItem';
import layouts from '../layout/defaultDialogLayout';
import Spinner from '../../Spinner';

const useStyles = makeStyles(() => ({
  ...layouts,
}));
export default function Editor(props) {
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
    resultWarning,
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
    if (handleInit) {
      handleInit();
    }
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
          mode={ruleMode}
          onChange={handleRuleChange}
          enableAutocomplete={enableAutocomplete}
          readOnly={disabled}
          hasError={!!error}
        />
      </PanelGridItem>
      <PanelGridItem gridArea="data" key={isSampleDataLoading}>
        <PanelTitle title={dataTitle} />
        {isSampleDataLoading ? (
          <Spinner centerAll />
        ) : (
          <CodePanel
            name="data"
            value={data}
            mode={dataMode}
            onChange={handleDataChange}
            readOnly={disabled}
            hasError={!!violations?.dataError}
          />
        )}
      </PanelGridItem>
      <PanelGridItem gridArea="result">
        <PanelTitle title={resultTitle} />
        <CodePanel
          name="result" value={result} mode={resultMode} readOnly
          hasWarning={!!resultWarning}
          />
      </PanelGridItem>
      {/* Hide error/warning panel when sample data is loading */}
      {!isSampleDataLoading && (
        (error || violations)
          ? <ErrorGridItem error={error} violations={violations} />
          : <WarningGridItem warning={resultWarning} />
      ) }
    </PanelGrid>
  );
}

Editor.propTypes = {
  rule: string,
  data: string,
  result: string,
  error: string,
  handleInit: func.isRequired,
  handleRuleChange: func.isRequired,
  handleDataChange: func.isRequired,
};

