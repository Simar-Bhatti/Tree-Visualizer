import { state } from '../state.js';

export function drawTree() {
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = '';

  if (!state.treeRoot) return;

  state.nodePositions.clear();

  const width = canvas.clientWidth;
  calculatePositions(
    state.treeRoot,
    width / 2,
    60,
    width / 4
  );


  // Edges
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('edges');
  drawEdges(state.treeRoot, svg);
  canvas.appendChild(svg);

  // Nodes above svg
  drawNodes(state.treeRoot, canvas);
}

/* ------------------ POSITIONING ------------------ */

function calculatePositions(node, x, y, gap) {
  if (!node) return;

  state.nodePositions.set(node.val, { x, y });

  calculatePositions(node.left, x - gap, y + 100, gap / 2);
  calculatePositions(node.right, x + gap, y + 100, gap / 2);
}

/* ------------------ EDGE DRAWING ------------------ */

function drawEdges(node, svg) {
  if (!node) return;

  const parentPos = state.nodePositions.get(node.val);
  const radius = 25;

  if (node.left) {
    drawEdge(node, node.left, svg, parentPos, radius);
    drawEdges(node.left, svg);
  }

  if (node.right) {
    drawEdge(node, node.right, svg, parentPos, radius);
    drawEdges(node.right, svg);
  }
}

function drawEdge(parent, child, svg, parentPos, radius) {
  const childPos = state.nodePositions.get(child.val);

  const angle = Math.atan2(
    childPos.y - parentPos.y,
    childPos.x - parentPos.x
  );

  const x1 = parentPos.x + radius * Math.cos(angle);
  const y1 = parentPos.y + radius * Math.sin(angle);
  const x2 = childPos.x - radius * Math.cos(angle);
  const y2 = childPos.y - radius * Math.sin(angle);

  const line = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'line'
  );

  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);

  svg.appendChild(line);
}

/* ------------------ NODE DRAWING ------------------ */

function drawNodes(node, canvas) {
  if (!node) return;

  const { x, y } = state.nodePositions.get(node.val);

  const wrapper = document.createElement('div');
  wrapper.className = 'node-wrapper';
  wrapper.style.left = x + 'px';
  wrapper.style.top = y + 'px';

  wrapper.innerHTML = `
    <div class="node" id="node-${node.val}">
      ${node.val}
    </div>
  `;

  canvas.appendChild(wrapper);

  drawNodes(node.left, canvas);
  drawNodes(node.right, canvas);
}
