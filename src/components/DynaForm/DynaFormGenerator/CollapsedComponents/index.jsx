import { makeStyles } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FormGenerator from '..';
import * as selectors from '../../../../reducers';
import ExpandMoreIcon from '../../../icons/ArrowDownIcon';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  expPanelTitle: {
    color: theme.palette.secondary.main,
  },
}));

export default function CollapsedComponents(props) {
  const classes = useStyles();
  const { containers, fieldMap, formKey, resource } = props;
  const transformedContainers =
    containers &&
    containers.map((container, index) => {
      const { label, collapsed = true, ...rest } = container;
      const header = typeof label === 'function' ? label(resource) : label;

      return (
        <ExpansionPannelExpandOnInValidState
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          collapsed={collapsed}
          index={index}
          layout={rest}
          classes={classes}
          header={header}
          fieldMap={fieldMap}
          formKey={formKey}
        />
      );
    });

  return <div className={classes.fieldsContainer}>{transformedContainers}</div>;
}

const ExpansionPannelExpandOnInValidState = props => {
  const { collapsed, layout, classes, header, fieldMap, formKey } = props;
  const [shouldExpand, setShouldExpand] = useState(!collapsed);
  const [expandOnce, setExpandOnce] = useState(false);
  const isPanelErrored = useSelector(state =>
    selectors.isExpansionPanelErroredForMetaForm(state, formKey, {
      layout,
      fieldMap,
    })
  );
  const isAnyExpansionPanelFieldVisible = useSelector(state =>
    selectors.isAnyFieldVisibleForMetaForm(state, formKey, {
      layout,
      fieldMap,
    })
  );

  const isPanelRequired = useSelector(state =>
    selectors.isExpansionPanelRequiredForMetaForm(state, formKey, {
      layout,
      fieldMap,
    })
  );

  useEffect(() => {
    if (!expandOnce && (isPanelErrored || isPanelRequired)) {
      setShouldExpand(true);
      setExpandOnce(true);
    }
  }, [expandOnce, isPanelErrored, isPanelRequired]);

  const toggleExpansionPanel = useCallback(() => {
    setShouldExpand(expand => !expand);
  }, []);

  if (!isAnyExpansionPanelFieldVisible) return null;

  return (
    <div className={classes.child}>
      <ExpansionPanel
        // eslint-disable-next-line react/no-array-index-key
        expanded={shouldExpand}>
        <ExpansionPanelSummary
          data-test={header}
          onClick={toggleExpansionPanel}
          expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.expPanelTitle}>{header}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails >
          <FormGenerator {...props} layout={layout} fieldMap={fieldMap} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};
