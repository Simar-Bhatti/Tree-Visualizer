import { state } from '../state.js';
import { buildTreeFromArray } from './tree.model.js';
import { drawTree } from './tree.render.js';
import { inorder, preorder, postorder } from './tree.traverse.js';

window.buildTree = () => {
  const input = document.getElementById('tree-input').value.trim();
  if (!input) return alert('Enter tree data');

  const arr = input.split(',').map(v =>
    v.trim().toLowerCase() === 'null' ? null : parseInt(v)
  );

  state.treeRoot = buildTreeFromArray(arr);
  drawTree();

  ['btn-inorder','btn-preorder','btn-postorder']
    .forEach(id => document.getElementById(id).disabled = false);
};

window.startInorder = async () => {
  if (state.isRunning) return;
  state.isRunning = true;
  await inorder(state.treeRoot);
  state.isRunning = false;
};

window.startPreorder = async () => {
  if (state.isRunning) return;
  state.isRunning = true;
  await preorder(state.treeRoot);
  state.isRunning = false;
};

window.startPostorder = async () => {
  if (state.isRunning) return;
  state.isRunning = true;
  await postorder(state.treeRoot);
  state.isRunning = false;
};
