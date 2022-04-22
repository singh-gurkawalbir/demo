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
  },
  accordionSummary: {
    width: '100%',
  },
  accordionDetails: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    display: 'block',
  },
  branchName: {
    marginLeft: theme.spacing(4),
    flexGrow: 1,
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
}));

const DragHandle = sortableHandle(() => <GripperIcon />);

export default function RouterPanel({position, branchName, onNameChange}) {
  const classes = useStyles();

  return (
    <li className={classes.listItem}>
      <Typography component="div" variant="overline" className={classes.index}>
        {position}
      </Typography>

      <div className={classes.accordionContainer}>
        <Accordion
          elevation={0}
          square
          className={classes.accordion}>
          <AccordionSummary
            classes={{expandIcon: classes.expandIcon}}
            className={classes.accordionSummary}
            expandIcon={<ArrowDownIcon />}
          >
            <div className={classes.summaryContainer}>
              <DragHandle />

              <div className={classes.branchName}>
                <EditableText
                  // multiline
                  allowOverflow
                  text={branchName}
                  // disabled={!canEdit}
                  defaultText="Unnamed branch: Click to add name"
                  onChange={title => onNameChange(title, position)}
                  inputClassName={classes.editableTextInput}
                />
              </div>

              <MoreActionsButton />
            </div>
          </AccordionSummary>

          <AccordionDetails className={classes.accordionDetails}>
            <BranchFilter />
          </AccordionDetails>
        </Accordion>
      </div>
    </li>
  );
}
