import { FormFragment } from 'react-forms-processor/dist';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Fragment, useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';

// TODO:Azhar please review this styling
const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    'justify-content': 'space-evenly',
    'flex-direction': 'row',
    padding: theme.spacing(1),
  },

  fieldsContainer: {
    display: 'flex',
    'justify-content': 'space-evenly',
    'flex-direction': 'column',
    padding: theme.spacing(1),
  },
}));
const TabComponent = props => {
  const { fieldSets, classes, fieldReferences } = props;
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = fieldSets.map((set, index) => {
    const { label: header } = set;

    // eslint-disable-next-line react/no-array-index-key
    return <Tab label={header} key={index} />;
  });
  const tabPannels = fieldSets.map((fieldSet, index) => {
    const { label, ...layout } = fieldSet;

    return (
      // eslint-disable-next-line react/no-array-index-key
      <Fragment key={index}>
        {selectedTab === index && (
          <FormGenerator layout={layout} fieldReferences={fieldReferences} />
        )}
      </Fragment>
    );
  });

  return (
    <div className={classes.fieldsContainer}>
      <Tabs
        value={selectedTab}
        onChange={(evt, value) => {
          setSelectedTab(value);
        }}>
        {tabs}
      </Tabs>
      {tabPannels}
    </div>
  );
};

const CollapsedComponents = props => {
  const { fieldSets, fieldReferences, classes } = props;

  return fieldSets.map((fieldSet, index) => {
    const { label: header, collapsed = true, ...layout } = fieldSet;

    return (
      // eslint-disable-next-line react/no-array-index-key
      <ExpansionPanel defaultExpanded={!collapsed} key={index}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{header}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.fieldsContainer}>
          <FormGenerator layout={layout} fieldReferences={fieldReferences} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  });
};

const ColumnComponents = props => {
  const { fieldSets, fieldReferences, classes } = props;

  return fieldSets.map((set, index) => {
    const { label: header, ...layout } = set;

    // TODO:its safe to use index for these elements since the metada is not expected to change
    return (
      // eslint-disable-next-line react/no-array-index-key
      <div key={index} className={classes.fieldsContainer}>
        <Typography>{header}</Typography>
        <FormGenerator layout={layout} fieldReferences={fieldReferences} />
      </div>
    );
  });
};

const getCorrespondingFieldReferences = (fields, fieldReferences) =>
  fields.map(field => {
    const transformedFieldValue = fieldReferences[field];

    if (!transformedFieldValue) {
      // eslint-disable-next-line no-console
      console.warn('no field reference found for field ', field);

      return {};
    }

    return transformedFieldValue;
  });

export default function FormGenerator(props) {
  const classes = useStyles();

  if (!props || !props.layout || !props.fieldReferences) return null;
  const { fieldReferences, layout } = props;
  const { fields, containers } = layout;
  let fieldsComponent;

  if (fields && fields.length > 0) {
    fieldsComponent = (
      <FormFragment
        defaultFields={getCorrespondingFieldReferences(fields, fieldReferences)}
      />
    );
  }

  let transformedContainers;

  if (containers && containers.length > 0) {
    transformedContainers = containers.map((container, index) => {
      const { fieldSets, type } = container;
      let convertedFieldSets;
      const supportedTypes = ['collapse', 'column', 'tab'];

      if (!type || !supportedTypes.includes(type)) {
        // eslint-disable-next-line no-console
        console.warn(
          'no type or incorrect type provided in the metadata ,supported types are',
          JSON.stringify(supportedTypes)
        );
      }

      if (type === 'collapse') {
        convertedFieldSets = (
          <CollapsedComponents
            fieldSets={fieldSets}
            fieldReferences={fieldReferences}
            classes={classes}
          />
        );
      } else if (type === 'column') {
        convertedFieldSets = (
          <ColumnComponents
            fieldSets={fieldSets}
            fieldReferences={fieldReferences}
            classes={classes}
          />
        );
      } else if (type === 'tab') {
        convertedFieldSets = (
          <TabComponent
            classes={classes}
            fieldSets={fieldSets}
            fieldReferences={fieldReferences}
          />
        );
      }

      return (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className={classes.container}>
          {convertedFieldSets}
        </div>
      );
    });
  }

  return (
    <div className={classes.fieldsContainer}>
      {fieldsComponent}
      {transformedContainers}
    </div>
  );
}
