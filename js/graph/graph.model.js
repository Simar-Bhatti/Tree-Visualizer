import { state } from '../state.js';

export function buildGraphStructure(n) {
  state.graph = {};
  for (let i = 0; i < n; i++) state.graph[i] = [];
}
