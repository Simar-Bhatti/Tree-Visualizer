import { sleep } from '../utils/sleep.js';

export async function inorder(node) {
  if (!node) return;
  await inorder(node.left);
  await visit(node);
  await inorder(node.right);
}

export async function preorder(node) {
  if (!node) return;
  await visit(node);
  await preorder(node.left);
  await preorder(node.right);
}

export async function postorder(node) {
  if (!node) return;
  await postorder(node.left);
  await postorder(node.right);
  await visit(node);
}

async function visit(node) {
  const el = document.getElementById(`node-${node.val}`);
  el.classList.add('highlight');
  await sleep(800);
  el.classList.remove('highlight');
  await sleep(200);
}
