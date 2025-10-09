class TreeNode {
      constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
      }
    }

    let root = null;
    let isRunning = false;
    let nodePositions = new Map();

    function buildTreeFromArray(arr) {
      if (!arr || arr.length === 0 || arr[0] === null) return null;
      
      const root = new TreeNode(arr[0]);
      const queue = [root];
      let i = 1;
      
      while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        
        if (i < arr.length && arr[i] !== null) {
          node.left = new TreeNode(arr[i]);
          queue.push(node.left);
        }
        i++;
        
        if (i < arr.length && arr[i] !== null) {
          node.right = new TreeNode(arr[i]);
          queue.push(node.right);
        }
        i++;
      }
      
      return root;
    }

    function calculatePositions(node, x, y, horizontalSpacing, depth = 0) {
      if (!node) return;
      
      nodePositions.set(node.val, { x, y });
      
      const newSpacing = horizontalSpacing / 2;
      const verticalGap = 100;
      
      if (node.left) {
        calculatePositions(node.left, x - horizontalSpacing, y + verticalGap, newSpacing, depth + 1);
      }
      
      if (node.right) {
        calculatePositions(node.right, x + horizontalSpacing, y + verticalGap, newSpacing, depth + 1);
      }
    }

    function drawTree() {
      const treeDiv = document.getElementById('tree');
      treeDiv.innerHTML = '';
      
      if (!root) {
        treeDiv.innerHTML = `
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <p>Enter tree data to visualize</p>
          </div>
        `;
        return;
      }
      
      nodePositions.clear();
      const containerWidth = treeDiv.clientWidth;
      const startX = containerWidth / 2;
      const startY = 60;
      const initialSpacing = containerWidth / 4;
      
      calculatePositions(root, startX, startY, initialSpacing);
      
      // Draw edges first
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('edges');
      
      function drawEdges(node) {
        if (!node) return;
        
        const parentPos = nodePositions.get(node.val);
        const nodeRadius = 25; // Half of node width (50px / 2)
        
        if (node.left) {
          const childPos = nodePositions.get(node.left.val);
          
          // Calculate angle and adjust start/end points
          const angle = Math.atan2(childPos.y - parentPos.y, childPos.x - parentPos.x);
          const startX = parentPos.x + nodeRadius * Math.cos(angle);
          const startY = parentPos.y + nodeRadius * Math.sin(angle);
          const endX = childPos.x - nodeRadius * Math.cos(angle);
          const endY = childPos.y - nodeRadius * Math.sin(angle);
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', startX);
          line.setAttribute('y1', startY);
          line.setAttribute('x2', endX);
          line.setAttribute('y2', endY);
          svg.appendChild(line);
          drawEdges(node.left);
        }
        
        if (node.right) {
          const childPos = nodePositions.get(node.right.val);
          
          // Calculate angle and adjust start/end points
          const angle = Math.atan2(childPos.y - parentPos.y, childPos.x - parentPos.x);
          const startX = parentPos.x + nodeRadius * Math.cos(angle);
          const startY = parentPos.y + nodeRadius * Math.sin(angle);
          const endX = childPos.x - nodeRadius * Math.cos(angle);
          const endY = childPos.y - nodeRadius * Math.sin(angle);
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', startX);
          line.setAttribute('y1', startY);
          line.setAttribute('x2', endX);
          line.setAttribute('y2', endY);
          svg.appendChild(line);
          drawEdges(node.right);
        }
      }
      
      drawEdges(root);
      treeDiv.appendChild(svg);
      
      // Draw nodes on top
      function drawNodes(node) {
        if (!node) return;
        
        const pos = nodePositions.get(node.val);
        const wrapper = document.createElement('div');
        wrapper.className = 'node-wrapper';
        wrapper.style.left = pos.x + 'px';
        wrapper.style.top = pos.y + 'px';
        
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'node';
        nodeDiv.id = `node-${node.val}`;
        nodeDiv.textContent = node.val;
        
        wrapper.appendChild(nodeDiv);
        treeDiv.appendChild(wrapper);
        
        drawNodes(node.left);
        drawNodes(node.right);
      }
      
      drawNodes(root);
    }

    function buildTree() {
      const input = document.getElementById('tree-input').value.trim();
      
      if (!input) {
        alert('Please enter tree data!');
        return;
      }
      
      try {
        const arr = input.split(',').map(val => {
          val = val.trim();
          return val.toLowerCase() === 'null' ? null : parseInt(val);
        });
        
        root = buildTreeFromArray(arr);
        drawTree();
        
        document.getElementById('btn-inorder').disabled = false;
        document.getElementById('btn-preorder').disabled = false;
        document.getElementById('btn-postorder').disabled = false;
        
        document.getElementById('traversal-info').classList.remove('show');
      } catch (e) {
        alert('Invalid input! Please check your data format.');
        console.error(e);
      }
    }

    function disableButtons() {
      document.getElementById('btn-inorder').disabled = true;
      document.getElementById('btn-preorder').disabled = true;
      document.getElementById('btn-postorder').disabled = true;
    }

    function enableButtons() {
      document.getElementById('btn-inorder').disabled = false;
      document.getElementById('btn-preorder').disabled = false;
      document.getElementById('btn-postorder').disabled = false;
    }

    function clearHighlights() {
      const nodes = document.querySelectorAll('.node');
      nodes.forEach(node => node.classList.remove('highlight'));
    }

    function showTraversalInfo(type) {
      const info = document.getElementById('traversal-info');
      const messages = {
        inorder: 'Inorder: Visit left subtree → Visit root → Visit right subtree',
        preorder: 'Preorder: Visit root → Visit left subtree → Visit right subtree',
        postorder: 'Postorder: Visit left subtree → Visit right subtree → Visit root'
      };
      info.textContent = messages[type];
      info.classList.add('show');
    }

    async function startInorder() {
      if (isRunning || !root) return;
      isRunning = true;
      disableButtons();
      clearHighlights();
      showTraversalInfo('inorder');
      await inorder(root);
      enableButtons();
      isRunning = false;
    }

    async function startPreorder() {
      if (isRunning || !root) return;
      isRunning = true;
      disableButtons();
      clearHighlights();
      showTraversalInfo('preorder');
      await preorder(root);
      enableButtons();
      isRunning = false;
    }

    async function startPostorder() {
      if (isRunning || !root) return;
      isRunning = true;
      disableButtons();
      clearHighlights();
      showTraversalInfo('postorder');
      await postorder(root);
      enableButtons();
      isRunning = false;
    }

    async function inorder(node) {
      if (!node) return;
      await inorder(node.left);
      await highlight(node);
      await inorder(node.right);
    }

    async function preorder(node) {
      if (!node) return;
      await highlight(node);
      await preorder(node.left);
      await preorder(node.right);
    }

    async function postorder(node) {
      if (!node) return;
      await postorder(node.left);
      await postorder(node.right);
      await highlight(node);
    }

    async function highlight(node) {
      const element = document.getElementById(`node-${node.val}`);
      if (element) {
        element.classList.add('highlight');
        await new Promise(r => setTimeout(r, 800));
        element.classList.remove('highlight');
        await new Promise(r => setTimeout(r, 200));
      }
    }