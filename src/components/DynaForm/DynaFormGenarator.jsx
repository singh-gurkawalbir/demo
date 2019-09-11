import { FormFragment } from 'react-forms-processor/dist';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useState } from 'react';
import { Tabs, Tab } from '@material-ui/core';

// TODO: Azhar please review this styling
const useStyles = makeStyles({
  fieldsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  child: {
    flexBasis: '100%',
    paddingRight: 10,
    '&:last-child': {
      paddingRight: 0,
    },
  },
});
const TabComponent = props => {
  const { fieldSets, classes, fieldReferences } = props;
  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = fieldSets.map((set, index) => {
    const { label: header } = set;

    // eslint-disable-next-line react/no-array-index-key
    return <Tab className={classes.child} label={header} key={index} />;
  });
  const tabPannels = fieldSets.map((fieldSet, index) => {
    const { label, ...layout } = fieldSet;

    return (
      // eslint-disable-next-line react/no-array-index-key
      <div key={index} className={classes.child}>
        {selectedTab === index && (
          <FormGenerator layout={layout} fieldReferences={fieldReferences} />
        )}
      </div>
    );
  });

  return (
    <div>
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
  const children = fieldSets.map((fieldSet, index) => {
    const { label: header, collapsed = true, ...layout } = fieldSet;

    return (
      <ExpansionPanel
        defaultExpanded={!collapsed}
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        className={classes.child}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{header}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <FormGenerator layout={layout} fieldReferences={fieldReferences} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  });

  return <div className={classes.container}>{children}</div>;
};

const ColumnComponents = props => {
  const { fieldSets, fieldReferences, classes } = props;
  const children = fieldSets.map((set, index) => {
    const { label: header, ...layout } = set;

    // TODO:its safe to use index for these elements since the metada is not expected to change
    return (
      // eslint-disable-next-line react/no-array-index-key
      <div key={index} className={classes.child}>
        <Typography>{header}</Typography>
        <FormGenerator layout={layout} fieldReferences={fieldReferences} />
      </div>
    );
  });

  return <div className={classes.container}>{children}</div>;
};

const getCorrespondingFieldReferences = (fields, fieldReferences) =>
  fields.map(field => {
    const transformedFieldValue = fieldReferences[field];

    if (!transformedFieldValue) {
      // eslint-disable-next-line no-console
      console.warn('no field reference found for field ', field);

      return {};
    }

    return { key: field, ...transformedFieldValue };
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
        className={classes.child}
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
        <div key={index}>{convertedFieldSets}</div>
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
