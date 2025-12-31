import { state } from '../state.js';
import { drawGraphCanvas } from './graph.render.js';
import { bfs, dfs, dijkstra, aStar } from './graph.algos.js';
import { resetGraphStates } from './graph.state.js';

/* ---------------- BUILD GRAPH ---------------- */

window.buildGraph = function () {
  const input = document.getElementById('graph-input').value.trim();
  const nodeCount = parseInt(document.getElementById('node-count').value);
  const type = document.getElementById('graph-type').value;

  if (!input || isNaN(nodeCount) || nodeCount < 1) {
    alert('Please enter valid graph data and node count');
    return;
  }

  state.isWeighted = type === 'weighted';
  state.graph = {};
  state.graphNodes = [];
  state.graphEdges = [];

  for (let i = 0; i < nodeCount; i++) {
    state.graph[i] = [];
  }

  input.split(',').forEach(edge => {
    const parts = edge.trim().split('-').map(Number);

    if (state.isWeighted) {
      const [u, v, w] = parts;
      state.graph[u].push({ node: v, weight: w });
      state.graph[v].push({ node: u, weight: w });
      state.graphEdges.push({ from: u, to: v, weight: w });
    } else {
      const [u, v] = parts;
      state.graph[u].push({ node: v });
      state.graph[v].push({ node: u });
      state.graphEdges.push({ from: u, to: v });
    }
  });

  const container = document.getElementById('canvas-container');
  const canvasDiv = document.getElementById('canvas');

  canvasDiv.innerHTML = `<canvas id="graph-canvas"></canvas>`;

  state.graphCanvas = document.getElementById('graph-canvas');
  state.graphCtx = state.graphCanvas.getContext('2d');

  state.graphCanvas.width = container.clientWidth;
  state.graphCanvas.height = container.clientHeight;

  const cx = state.graphCanvas.width / 2;
  const cy = state.graphCanvas.height / 2;
  const r = Math.min(cx, cy) - 100;

  for (let i = 0; i < nodeCount; i++) {
    const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
    state.graphNodes.push({
      id: i,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      state: 'unvisited'
    });
  }

  drawGraphCanvas();

  document.getElementById('btn-bfs').disabled = false;
  document.getElementById('btn-dfs').disabled = false;
  document.getElementById('btn-dijkstra').disabled = !state.isWeighted;
  document.getElementById('btn-astar').disabled = !state.isWeighted;
};

/* ---------------- ALGORITHM BUTTONS ---------------- */

window.startBFS = async function () {
  if (state.isRunning) return;
  const s = Number(document.getElementById('start-node').value);
  if (!(s in state.graph)) return alert('Invalid start node');

  state.isRunning = true;
  resetGraphStates();
  await bfs(s);
  state.isRunning = false;
};

window.startDFS = async function () {
  if (state.isRunning) return;
  const s = Number(document.getElementById('start-node').value);
  if (!(s in state.graph)) return alert('Invalid start node');

  state.isRunning = true;
  resetGraphStates();
  await dfs(s, new Set());
  state.isRunning = false;
};

window.startDijkstra = async function () {
  if (state.isRunning) return;
  const s = Number(document.getElementById('start-node').value);
  const e = Number(document.getElementById('end-node').value);

  state.isRunning = true;
  resetGraphStates();
  await dijkstra(s, e);
  state.isRunning = false;
};

window.startAStar = async function () {
  if (state.isRunning) return;
  const s = Number(document.getElementById('start-node').value);
  const e = Number(document.getElementById('end-node').value);

  state.isRunning = true;
  resetGraphStates();
  await aStar(s, e);
  state.isRunning = false;
};

