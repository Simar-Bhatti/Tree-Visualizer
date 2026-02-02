import { state } from '../state.js';
import { sleep } from '../utils/sleep.js';
import { drawGraphCanvas } from './graph.render.js';
import { MinPriorityQueue } from './priorityQueue.js';  

/* ---------------- BFS ---------------- */

export async function bfs(start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);

  while (queue.length) {
    const u = queue.shift();
    state.graphNodes[u].state = 'current';
    drawGraphCanvas();
    await sleep(800);

    state.graphNodes[u].state = 'visited';

    for (const { node: v } of state.graph[u]) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
      }
    }

    drawGraphCanvas();
    await sleep(400);
  }
}

/* ---------------- DFS ---------------- */

export async function dfs(u, visited) {
  visited.add(u);
  state.graphNodes[u].state = 'current';
  drawGraphCanvas();
  await sleep(800);

  state.graphNodes[u].state = 'visited';
  drawGraphCanvas();
  await sleep(400);

  for (const { node: v } of state.graph[u]) {
    if (!visited.has(v)) {
      await dfs(v, visited);
    }
  }
}

/* ---------------- DIJKSTRA ---------------- */

export async function dijkstra(start, end) {
  const dist = {};
  const prev = {};
  const pq = new MinPriorityQueue();

  for (const node in state.graph) {
    dist[node] = Infinity;
    prev[node] = null;
  }

  dist[start] = 0;
  pq.push(start, 0);

  while (!pq.isEmpty()) {
    const { node: u } = pq.pop();

    state.graphNodes[u].state = 'current';
    drawGraphCanvas();
    await sleep(800);

    if (u === end) break;

    for (const { node: v, weight } of state.graph[u]) {
      const alt = dist[u] + weight;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        pq.push(v, alt); 
      }
    }

    state.graphNodes[u].state = 'visited';
    drawGraphCanvas();
    await sleep(400);
  }

  await highlightPath(prev, start, end);
}


/* ---------------- A* ---------------- */

function heuristic(a, b) {
  const dx = state.graphNodes[a].x - state.graphNodes[b].x;
  const dy = state.graphNodes[a].y - state.graphNodes[b].y;
  return Math.sqrt(dx * dx + dy * dy) / 100;
}

export async function aStar(start, end) {
  const g = {};
  const f = {};
  const prev = {};
  const pq = new MinPriorityQueue();
  const closed = new Set();

  for (const node in state.graph) {
    g[node] = Infinity;
    f[node] = Infinity;
    prev[node] = null;
  }

  g[start] = 0;
  f[start] = heuristic(start, end);
  pq.push(start, f[start]);

  while (!pq.isEmpty()) {
    const { node: u } = pq.pop();

    if (closed.has(u)) continue;
    closed.add(u);

    state.graphNodes[u].state = 'current';
    drawGraphCanvas();
    await sleep(800);

    if (u === end) break;

    for (const { node: v, weight } of state.graph[u]) {
      if (closed.has(v)) continue;

      const temp = g[u] + weight;
      if (temp < g[v]) {
        g[v] = temp;
        f[v] = g[v] + heuristic(v, end);
        prev[v] = u;
        pq.push(v, f[v]);
      }
    }

    state.graphNodes[u].state = 'visited';
    drawGraphCanvas();
    await sleep(400);
  }

  await highlightPath(prev, start, end);
}


/* ---------------- PATH HIGHLIGHT ---------------- */

async function highlightPath(prev, start, end) {
  const path = [];
  let cur = end;

  while (cur !== null) {
    path.unshift(cur);
    cur = prev[cur];
  }

  if (path[0] !== start) return;

  for (let i = 0; i < path.length; i++) {
    state.graphNodes[path[i]].state = 'path';

    if (i > 0) {
      const u = path[i - 1];
      const v = path[i];
      for (const e of state.graphEdges) {
        if (
          (e.from === u && e.to === v) ||
          (e.from === v && e.to === u)
        ) {
          e.highlighted = true;
        }
      }
    }

    drawGraphCanvas();
    await sleep(500);
  }
}
