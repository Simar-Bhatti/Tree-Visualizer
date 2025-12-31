export const state = {
  currentView: 'tree',
  isRunning: false,

  // Tree
  treeRoot: null,
  nodePositions: new Map(),

  // Graph
  graph: null,
  graphCanvas: null,
  graphCtx: null,
  graphNodes: [],
  graphEdges: [],
  isWeighted: false
};
