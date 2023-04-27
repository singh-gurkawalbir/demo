import makeStyles from '@mui/styles/makeStyles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FormGenerator from '..';
import { selectors } from '../../../../reducers';
import ExpandMoreIcon from '../../../icons/ArrowDownIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { emptyObject } from '../../../../constants';
import CollapsedComponentActions from './CollapsedComponentActions';

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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  accordionHeader: {
    display: 'flex',
    '& .MuiAccordionSummary-expandIconWrapper': {
      margin: '1px 4px 0 0',
    },
  },
}));

export default function CollapsedComponents(props) {
  const classes = useStyles();
  const { containers, fieldMap, formKey, resourceType, resourceId} = props;

  const resource = useSelectorMemo(selectors.makeResourceDataSelector, resourceType, resourceId)?.merged || emptyObject;
  const transformedContainers =
    containers &&
    containers.map((container, index) => {
      const { label, collapsed = true, actionId, ...rest } = container;
      const header = typeof label === 'function' ? label(resource) : label;

      return (
        <AccordionExpandOnInValidState
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          collapsed={collapsed}
          index={index}
          layout={rest}
          classes={classes}
          header={header}
          fieldMap={fieldMap}
          formKey={formKey}
          resourceType={resourceType}
          resourceId={resourceId}
          actionId={actionId}
        />
      );
    });

  return <div className={classes.fieldsContainer}>{transformedContainers}</div>;
}

const AccordionExpandOnInValidState = props => {
  const { collapsed, layout, classes, header, fieldMap, formKey} = props;
  const revalidationIdentifier = useSelector(state => selectors.formState(state, formKey)?.validationOnSaveIdentifier);
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

  useEffect(() => {
    if (!shouldExpand && isPanelErrored) {
      setShouldExpand(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revalidationIdentifier]);

  const toggleExpansionPanel = useCallback(() => {
    setShouldExpand(expand => !expand);
  }, []);

  if (!isAnyExpansionPanelFieldVisible) return null;

  return (
    <div className={classes.child}>
      <Accordion expanded={shouldExpand} elevation={0}>
        <AccordionSummary
          data-test={header}
          onClick={toggleExpansionPanel}
          expandIcon={<ExpandMoreIcon />}
          className={classes.accordionHeader}>
          <div className={classes.header}>
            <Typography className={classes.expPanelTitle}>{header}</Typography>
            {shouldExpand && <CollapsedComponentActions className={classes.actions} {...props} />}
          </div>
        </AccordionSummary>
        <AccordionDetails >
          <FormGenerator {...props} layout={layout} fieldMap={fieldMap} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
