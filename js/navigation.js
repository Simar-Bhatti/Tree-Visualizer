import { state } from './state.js';

export function showTree() {
  state.currentView = 'tree';

  document.getElementById('tree-controls').classList.remove('hidden');
  document.getElementById('graph-controls').classList.add('hidden');

  document.getElementById('nav-tree').classList.add('active');
  document.getElementById('nav-graph').classList.remove('active');

  document.getElementById('page-title').innerHTML = '🌳 Binary Tree Visualizer';

  document.getElementById('canvas').innerHTML = emptyTree();
}

export function showGraph() {
  state.currentView = 'graph';

  document.getElementById('tree-controls').classList.add('hidden');
  document.getElementById('graph-controls').classList.remove('hidden');

  document.getElementById('nav-tree').classList.remove('active');
  document.getElementById('nav-graph').classList.add('active');

  document.getElementById('page-title').innerHTML = '🔗 Graph Algorithm Visualizer';

  document.getElementById('canvas').innerHTML = emptyGraph();
}

function emptyTree() {
  return `<div class="empty-state"><p>Enter tree data to visualize</p></div>`;
}

function emptyGraph() {
  return `<div class="empty-state"><p>Enter graph data to visualize</p></div>`;
}
