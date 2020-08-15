import loadable from '../../utils/loadable';
import retry from '../../utils/retry';

const CodeEditor = loadable(() => retry(() => import(/* webpackChunkName: 'CodeEditor' */ './editor')));

export default CodeEditor;
