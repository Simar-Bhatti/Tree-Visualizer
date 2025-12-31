import { state } from '../state.js';
import { drawGraphCanvas } from './graph.render.js';

export function resetGraphStates() {
  for (const node of state.graphNodes) {
    node.state = 'unvisited';
  }

  for (const edge of state.graphEdges) {
    edge.highlighted = false;
  }

  drawGraphCanvas();
}
