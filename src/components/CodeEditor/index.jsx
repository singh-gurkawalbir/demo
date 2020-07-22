import loadable from '../../utils/loadable';

const CodeEditor = loadable(() => import(/* webpackChunkName: 'CodeEditor' */ './editor'));
export default CodeEditor;
