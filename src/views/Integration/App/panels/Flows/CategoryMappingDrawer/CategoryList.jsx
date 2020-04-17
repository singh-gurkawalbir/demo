import { useState, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, Typography, Collapse } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import ArrowUpIcon from '../../../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../../components/icons/ArrowDownIcon';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2),
    wordBreak: 'break-word',
  },
  listItem: {
    color: theme.palette.text.primary,
    width: '100%',
    cursor: 'pointer',
    wordBreak: 'break-word',
  },
  activeListItem: {
    color: theme.palette.primary.main,
  },
}));

export default function CategoryList({ integrationId, flowId }) {
  const classes = useStyles();
  const mappedCategories =
    useSelector(state =>
      selectors.mappedCategories(state, integrationId, flowId)
    ) || [];
  const [listCollapseState, setListCollapseState] = useState({});
  const handleListClick = id => () => {
    setListCollapseState({
      ...listCollapseState,
      [id]: !listCollapseState[id],
    });
  };

  return (
    <List>
      {mappedCategories.map(({ name, id, children }) => (
        <Fragment key={id}>
          <ListItem key={id}>
            <NavLink
              className={classes.listItem}
              activeClassName={classes.activeListItem}
              to={id}
              data-test={id}>
              {name}
            </NavLink>
            {listCollapseState[id] ? (
              <ArrowUpIcon onClick={handleListClick(id)} />
            ) : (
              <ArrowDownIcon onClick={handleListClick(id)} />
            )}
          </ListItem>
          {!!children && !!children.length && (
            <Collapse in={!!listCollapseState[id]} timeout="auto" unmountOnExit>
              {children.map(({ id, name }) => (
                <List key={id} component="div" disablePadding>
                  <Typography className={classes.nested} variant="body2">
                    {name}
                  </Typography>
                </List>
              ))}
            </Collapse>
          )}
        </Fragment>
      ))}
    </List>
  );
}
