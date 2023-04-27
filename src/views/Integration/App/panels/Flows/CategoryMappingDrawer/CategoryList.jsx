import React, { useState, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { List, ListItem, Typography, Collapse } from '@mui/material';
import { selectors } from '../../../../../../reducers';
import ArrowUpIcon from '../../../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../../components/icons/ArrowDownIcon';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2),
    wordBreak: 'break-word',
  },
  doubleNested: {
    paddingLeft: theme.spacing(6),
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
  const mappedCategories = useSelectorMemo(selectors.mkMappedCategories, integrationId, flowId) || [];
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
              <ArrowUpIcon data-testid="arrow-up-icon" onClick={handleListClick(id)} />
            ) : (
              <ArrowDownIcon data-testid="arrow-down-icon" onClick={handleListClick(id)} />
            )}
          </ListItem>
          {!!children && !!children.length && (
            <Collapse in={!!listCollapseState[id]} timeout="auto" unmountOnExit>
              {children.map(({ id, name, children }) => (
                <List key={id} component="div" disablePadding>
                  <Typography className={classes.nested} variant="body2">
                    {name}
                  </Typography>
                  {!!children &&
                    !!children.length &&
                    children.map(({ id, name }) => (
                      <List key={id} component="div" disablePadding>
                        <Typography
                          className={classes.doubleNested}
                          variant="body2">
                          {name}
                        </Typography>
                      </List>
                    ))}
                </List>
              ))}
            </Collapse>
          )}
        </Fragment>
      ))}
    </List>
  );
}
