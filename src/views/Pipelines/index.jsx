import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import loadable from '../../utils/loadable';

const CreatePipeline = loadable(() =>
  import(/* webpackChunkName: 'Pipelines.CreatePipeline' */ './CreatePipeline')
);
const ListPipelines = loadable(() =>
  import(/* webpackChunkName: 'Pipelines.ListPipelines' */ './ListPipelines')
);

@hot(module)
export default class Pipelines extends Component {
  render() {
    const {
      match: { path },
    } = this.props;

    return (
      <Switch>
        <Route path={`${path}/create`} component={CreatePipeline} />
        <Route path={path} component={ListPipelines} />
      </Switch>
    );
  }
}
