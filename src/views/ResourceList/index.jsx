import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import CeligoPageBar from '../../AppNew/CeligoPageBar';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import infoText from './infoText';
import CeligoIconButton from '../../components/IconButton';
import * as selectors from '../../reducers';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

function PageContent(props) {
  const { match } = props;
  const { resourceType } = match.params;
  const classes = useStyles();
  const dispatch = useDispatch();
  const filter = useSelector(
    state => selectors.filter(state, resourceType) || { take: 3 }
  );
  const list = useSelector(state =>
    selectors.resourceList(state, {
      type: resourceType,
      take: filter.take || 3,
      keyword: filter.keyword,
    })
  );
  const handleMore = () => {
    dispatch(actions.patchFilter(resourceType, { take: filter.take + 2 }));
  };

  const resourceName = MODEL_PLURAL_TO_LABEL[resourceType];

  return (
    <Fragment>
      <CeligoPageBar
        title={`${resourceName}s`}
        infoText={infoText[resourceType]}>
        <Button variant="text">
          <AddIcon /> New {resourceName}
        </Button>
        <CeligoIconButton variant="text">
          <AddIcon /> Install Zip
        </CeligoIconButton>
      </CeligoPageBar>
      <div className={classes.content}>{JSON.stringify(list)}</div>
      {list.filtered > list.count && (
        <Button
          onClick={handleMore}
          variant="contained"
          size="medium"
          color="primary"
          className={classes.button}>
          Show more results ({list.filtered - list.count} left)
        </Button>
      )}
    </Fragment>
  );
}

export default withRouter(PageContent);
