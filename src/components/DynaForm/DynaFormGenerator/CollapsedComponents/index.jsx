import { makeStyles } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import FormGenerator from '../';
import * as selectors from '../../../../reducers';
import ExpandMoreIcon from '../../../icons/ArrowRightIcon';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  expPanelSummary: {
    flexDirection: 'row-reverse',
    paddingLeft: 0,
    minHeight: 'unset',
    height: 48,
    display: 'inline-flex',
    '& > .MuiExpansionPanelSummary-expandIcon': {
      padding: 0,
      margin: theme.spacing(-0.5, 0.5, 0, 0),
      '&.Mui-expanded': {
        transform: `rotate(90deg)`,
      },
    },
    '&.Mui-expanded': {
      minHeight: 0,
    },
    '& > .MuiExpansionPanelSummary-content': {
      margin: 0,
      '&.Mui-expanded': {
        margin: 0,
      },
    },
  },
  expansionPanel: {
    boxShadow: 'none',
    background: 'none',
  },
  expDetails: {
    padding: 0,
  },
}));

export default function CollapsedComponents(props) {
  const classes = useStyles();
  const { containers, fieldMap, formKey } = props;
  const transformedContainers =
    containers &&
    containers.map((container, index) => {
      const { label: header, collapsed = true, ...rest } = container;

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

  useEffect(() => {
    if (!expandOnce && isPanelErrored) {
      setShouldExpand(true);
      setExpandOnce(true);
    }
  }, [expandOnce, isPanelErrored]);

  if (!isAnyExpansionPanelFieldVisible) return null;

  return (
    <div className={classes.child}>
      <ExpansionPanel
        className={classes.expansionPanel}
        // eslint-disable-next-line react/no-array-index-key
        expanded={shouldExpand}>
        <ExpansionPanelSummary
          data-test={header}
          className={classes.expPanelSummary}
          onClick={() => setShouldExpand(expand => !expand)}
          expandIcon={<ExpandMoreIcon />}>
          <Typography>{header}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.expDetails}>
          <FormGenerator {...props} layout={layout} fieldMap={fieldMap} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};
