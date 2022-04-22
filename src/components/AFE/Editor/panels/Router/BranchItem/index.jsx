import clsx from 'clsx';
import React from 'react';
import { makeStyles,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { sortableHandle } from 'react-sortable-hoc';
import ArrowDownIcon from '../../../../../icons/ArrowDownIcon';
import EditableText from '../../../../../EditableText';
import GripperIcon from '../../../../../icons/GripperIcon';
import MoreActionsButton from '../MoreActionsButton';
import BranchFilter from '../BranchFilter';
import InfoIconButton from '../../../../../InfoIconButton';

const useStyles = makeStyles(theme => ({
  summaryContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  accordion: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    marginBottom: theme.spacing(2),
    borderRadius: 0,
    padding: 0,
  },
  accordionSummary: {
    width: '100%',
  },
  accordionDetails: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    display: 'block',
    padding: 0,
    '& > div > div': {
      margin: 0,
      border: 'none',
    },
  },
  branchName: {
    marginLeft: theme.spacing(1),
  },
  description: {
    flexGrow: 1,
  },
  expandable: {
    marginLeft: theme.spacing(4),
  },
  expandIcon: {
    position: 'absolute',
    left: theme.spacing(5),
  },
  listItem: {
    display: 'flex',
  },
  index: {
    flex: 'none',
    textAlign: 'center',
    marginRight: theme.spacing(1.5),
    paddingTop: 2,
    width: 22,
    height: 22,
    borderRadius: 16,
    backgroundColor: theme.palette.text.hint,
    color: theme.palette.common.white,
  },
  accordionContainer: {
    flexGrow: 1,
  },
  expanded: {
    marginBottom: '16px !important',
    // backgroundColor: 'red',
  },
}));

const DragHandle = sortableHandle(() => <GripperIcon style={{cursor: 'grab'}} />);

export default function RouterPanel({
  expandable, expanded, position, branchName, description, onNameChange, onToggleExpand}
) {
  const classes = useStyles();

  return (
    <li className={classes.listItem}>
      <Typography component="div" variant="overline" className={classes.index}>
        {position}
      </Typography>

      <div className={classes.accordionContainer}>
        <Accordion
          elevation={0}
          onChange={(event, expanded) => onToggleExpand(expanded, position)}
          expanded={!!expanded}
          square
          classes={{expanded: classes.expanded}}
          className={classes.accordion}>
          <AccordionSummary
            classes={{expandIcon: classes.expandIcon}}
            className={classes.accordionSummary}
            expandIcon={expandable && <ArrowDownIcon />}
          >
            <div className={classes.summaryContainer}>
              <DragHandle />
              <div
                className={clsx(
                  classes.branchName,
                  {[classes.expandable]: expandable}
                )}>
                <EditableText
                  allowOverflow
                  text={branchName}
                  defaultText="Unnamed branch: Click to add name"
                  onChange={title => onNameChange(title, position)}
                  inputClassName={classes.editableTextInput}
                />
              </div>

              {description && (
                <div className={classes.description}>
                  <InfoIconButton size="xs" info={description} />
                </div>
              )}

              <MoreActionsButton />
            </div>
          </AccordionSummary>

          {expandable && (
          <AccordionDetails className={classes.accordionDetails}>
            <BranchFilter />
          </AccordionDetails>
          )}
        </Accordion>
      </div>
    </li>
  );
}
