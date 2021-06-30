import { makeStyles } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FormGenerator from '..';
import { selectors } from '../../../../reducers';
import ExpandMoreIcon from '../../../icons/ArrowDownIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../../utils/constants';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  expPanelTitle: {
    color: theme.palette.secondary.main,
  },
  child: {
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    borderRadius: theme.spacing(0.5),
  },
}));

export default function CollapsedComponents(props) {
  const classes = useStyles();
  const { containers, fieldMap, formKey, resourceType, resourceId, dataPublic} = props;

  const resource = useSelectorMemo(selectors.makeResourceDataSelector, resourceType, resourceId)?.merged || emptyObject;
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
          dataPublic={dataPublic}
        />
      );
    });

  return <div className={classes.fieldsContainer}>{transformedContainers}</div>;
}

const ExpansionPannelExpandOnInValidState = props => {
  const { collapsed, layout, classes, header, fieldMap, formKey, dataPublic } = props;
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
      <Accordion
        // eslint-disable-next-line react/no-array-index-key
        expanded={shouldExpand} elevation={0}>
        <AccordionSummary
          data-test={header}
          onClick={toggleExpansionPanel}
          expandIcon={<ExpandMoreIcon />}>
          <Typography data-public={!!dataPublic} className={classes.expPanelTitle}>{header}</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <FormGenerator {...props} layout={layout} fieldMap={fieldMap} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
