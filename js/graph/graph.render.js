import { state } from '../state.js';

export function drawGraphCanvas() {
  if (!state.graphCtx) return;

  const ctx = state.graphCtx;
  const canvas = state.graphCanvas;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  /* ---------- DRAW EDGES ---------- */
  ctx.lineWidth = 3;

  for (const edge of state.graphEdges) {
    const from = state.graphNodes[edge.from];
    const to = state.graphNodes[edge.to];

    if (edge.highlighted) {
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 4;
    } else {
      ctx.strokeStyle = 'rgba(255,255,255,0.6)';
      ctx.lineWidth = 3;
    }

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Draw weight
    if (state.isWeighted && edge.weight !== undefined) {
      const mx = (from.x + to.x) / 2;
      const my = (from.y + to.y) / 2;

      ctx.fillStyle = '#1a1a20';
      ctx.fillRect(mx - 15, my - 12, 30, 24);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(edge.weight, mx, my);
    }
  }

  /* ---------- DRAW NODES ---------- */
  for (const node of state.graphNodes) {
    let gradient = ctx.createLinearGradient(
      node.x - 25, node.y - 25,
      node.x + 25, node.y + 25
    );

    if (node.state === 'current') {
      gradient.addColorStop(0, '#ffd89b');
      gradient.addColorStop(1, '#ff6347');
    } else if (node.state === 'visited') {
      gradient.addColorStop(0, '#56ccf2');
      gradient.addColorStop(1, '#2f80ed');
    } else if (node.state === 'path') {
      gradient.addColorStop(0, '#11998e');
      gradient.addColorStop(1, '#38ef7d');
    } else {
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, '#e6e6e6');
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#0b0b0e';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.id, node.x, node.y);
  }
}
