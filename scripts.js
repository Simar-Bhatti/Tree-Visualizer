 // ============= GLOBAL STATE =============
    let currentView = 'tree';
    let isRunning = false;

    // Tree state
    let treeRoot = null;
    let nodePositions = new Map();

    // Graph state
    let graph = null;
    let graphCanvas = null;
    let graphCtx = null;
    let graphNodes = [];
    let graphEdges = [];
    let isWeighted = false;

    // ============= NAVIGATION =============
    function showTree() {
      currentView = 'tree';
      document.getElementById('tree-controls').classList.remove('hidden');
      document.getElementById('graph-controls').classList.add('hidden');
      document.getElementById('nav-tree').classList.add('active');
      document.getElementById('nav-graph').classList.remove('active');
      document.getElementById('page-title').innerHTML = '🌳 Binary Tree Visualizer';
      
      const canvas = document.getElementById('canvas');
      canvas.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <p>Enter tree data to visualize</p>
        </div>
      `;
    }

    function showGraph() {
      currentView = 'graph';
      document.getElementById('tree-controls').classList.add('hidden');
      document.getElementById('graph-controls').classList.remove('hidden');
      document.getElementById('nav-tree').classList.remove('active');
      document.getElementById('nav-graph').classList.add('active');
      document.getElementById('page-title').innerHTML = '🔗 Graph Algorithm Visualizer';
      
      const canvas = document.getElementById('canvas');
      canvas.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="5" r="3"/>
            <circle cx="5" cy="15" r="3"/>
            <circle cx="19" cy="15" r="3"/>
            <line x1="12" y1="8" x2="7" y2="12"/>
            <line x1="12" y1="8" x2="17" y2="12"/>
          </svg>
          <p>Enter graph data to visualize</p>
        </div>
      `;
    }

    // Update graph type example
    document.getElementById('graph-type')?.addEventListener('change', (e) => {
      const example = document.getElementById('graph-example');
      if (e.target.value === 'weighted') {
        example.textContent = 'Weighted: 0-1-5,0-2-3,1-3-2,2-4-1 (node-node-weight)';
      } else {
        example.textContent = 'Unweighted: 0-1,0-2,1-3,1-4,2-4 (node-node)';
      }
    });

    // ============= TREE IMPLEMENTATION =============
    class TreeNode {
      constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
      }
    }

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
      const treeDiv = document.getElementById('canvas');
      treeDiv.innerHTML = '';
      
      if (!treeRoot) {
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
      
      calculatePositions(treeRoot, startX, startY, initialSpacing);
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('edges');
      
      function drawEdges(node) {
        if (!node) return;
        
        const parentPos = nodePositions.get(node.val);
        const nodeRadius = 25;
        
        if (node.left) {
          const childPos = nodePositions.get(node.left.val);
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
      
      drawEdges(treeRoot);
      treeDiv.appendChild(svg);
      
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
      
      drawNodes(treeRoot);
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
        
        treeRoot = buildTreeFromArray(arr);
        drawTree();
        
        document.getElementById('btn-inorder').disabled = false;
        document.getElementById('btn-preorder').disabled = false;
        document.getElementById('btn-postorder').disabled = false;
        
        document.getElementById('tree-algo-info').classList.remove('show');
      } catch (e) {
        alert('Invalid input! Please check your data format.');
        console.error(e);
      }
    }

    function clearTreeHighlights() {
      const nodes = document.querySelectorAll('.node');
      nodes.forEach(node => node.classList.remove('highlight'));
    }

    function showTreeAlgoInfo(type) {
      const info = document.getElementById('tree-algo-info');
      const messages = {
        inorder: '🔄 Inorder: Visit left subtree → Visit root → Visit right subtree',
        preorder: '🔄 Preorder: Visit root → Visit left subtree → Visit right subtree',
        postorder: '🔄 Postorder: Visit left subtree → Visit right subtree → Visit root'
      };
      info.textContent = messages[type];
      info.classList.add('show');
    }

    async function startInorder() {
      if (isRunning || !treeRoot) return;
      isRunning = true;
      disableTreeButtons();
      clearTreeHighlights();
      showTreeAlgoInfo('inorder');
      await inorder(treeRoot);
      enableTreeButtons();
      isRunning = false;
    }

    async function startPreorder() {
      if (isRunning || !treeRoot) return;
      isRunning = true;
      disableTreeButtons();
      clearTreeHighlights();
      showTreeAlgoInfo('preorder');
      await preorder(treeRoot);
      enableTreeButtons();
      isRunning = false;
    }

    async function startPostorder() {
      if (isRunning || !treeRoot) return;
      isRunning = true;
      disableTreeButtons();
      clearTreeHighlights();
      showTreeAlgoInfo('postorder');
      await postorder(treeRoot);
      enableTreeButtons();
      isRunning = false;
    }

    async function inorder(node) {
      if (!node) return;
      await inorder(node.left);
      await highlightTreeNode(node);
      await inorder(node.right);
    }

    async function preorder(node) {
      if (!node) return;
      await highlightTreeNode(node);
      await preorder(node.left);
      await preorder(node.right);
    }

    async function postorder(node) {
      if (!node) return;
      await postorder(node.left);
      await postorder(node.right);
      await highlightTreeNode(node);
    }

    async function highlightTreeNode(node) {
      const element = document.getElementById(`node-${node.val}`);
      if (element) {
        element.classList.add('highlight');
        await new Promise(r => setTimeout(r, 800));
        element.classList.remove('highlight');
        await new Promise(r => setTimeout(r, 200));
      }
    }

    function disableTreeButtons() {
      document.getElementById('btn-inorder').disabled = true;
      document.getElementById('btn-preorder').disabled = true;
      document.getElementById('btn-postorder').disabled = true;
    }

    function enableTreeButtons() {
      document.getElementById('btn-inorder').disabled = false;
      document.getElementById('btn-preorder').disabled = false;
      document.getElementById('btn-postorder').disabled = false;
    }

    // ============= GRAPH IMPLEMENTATION =============
    function buildGraph() {
      const input = document.getElementById('graph-input').value.trim();
      const nodeCount = parseInt(document.getElementById('node-count').value);
      const graphType = document.getElementById('graph-type').value;
      
      if (!input || !nodeCount || nodeCount < 1) {
        alert('Please enter graph data and node count!');
        return;
      }
      
      try {
        isWeighted = graphType === 'weighted';
        graphNodes = [];
        graphEdges = [];
        
        // Create graph structure
        graph = {};
        for (let i = 0; i < nodeCount; i++) {
          graph[i] = [];
        }
        
        // Parse edges
        const edges = input.split(',').map(e => e.trim());
        
        for (const edge of edges) {
          if (isWeighted) {
            const [from, to, weight] = edge.split('-').map(v => v.trim());
            const fromNode = parseInt(from);
            const toNode = parseInt(to);
            const edgeWeight = parseFloat(weight);
            
            graph[fromNode].push({ node: toNode, weight: edgeWeight });
            graph[toNode].push({ node: fromNode, weight: edgeWeight });
            graphEdges.push({ from: fromNode, to: toNode, weight: edgeWeight });
          } else {
            const [from, to] = edge.split('-').map(v => v.trim());
            const fromNode = parseInt(from);
            const toNode = parseInt(to);
            
            graph[fromNode].push({ node: toNode });
            graph[toNode].push({ node: fromNode });
            graphEdges.push({ from: fromNode, to: toNode });
          }
        }
        
        // Position nodes in a circle
        const canvas = document.getElementById('canvas');
        canvas.innerHTML = '<canvas id="graph-canvas"></canvas>';
        const legend = `
          <div class="legend">
            <div class="legend-item">
              <div class="legend-color" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>
              <span>Unvisited</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: linear-gradient(135deg, #ffd89b 0%, #ff6347 100%);"></div>
              <span>Current</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: linear-gradient(135deg, #56ccf2 0%, #2f80ed 100%);"></div>
              <span>Visited</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);"></div>
              <span>Path</span>
            </div>
          </div>
        `;
        canvas.insertAdjacentHTML('beforeend', legend);
        
        graphCanvas = document.getElementById('graph-canvas');
        graphCtx = graphCanvas.getContext('2d');
        
        // Set canvas size to match container
        const container = document.getElementById('canvas-container');
        graphCanvas.width = container.clientWidth;
        graphCanvas.height = container.clientHeight;
        
        const centerX = graphCanvas.width / 2;
        const centerY = graphCanvas.height / 2;
        const radius = Math.min(centerX, centerY) - 100;
        
        for (let i = 0; i < nodeCount; i++) {
          const angle = (2 * Math.PI * i) / nodeCount - Math.PI / 2;
          graphNodes.push({
            id: i,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            state: 'unvisited'
          });
        }
        
        drawGraphCanvas();
        
        document.getElementById('btn-bfs').disabled = false;
        document.getElementById('btn-dfs').disabled = false;
        document.getElementById('btn-dijkstra').disabled = !isWeighted;
        document.getElementById('btn-astar').disabled = !isWeighted;
        document.getElementById('btn-reset').disabled = false;
        
      } catch (e) {
        alert('Invalid input! Please check your data format.');
        console.error(e);
      }
    }

    function drawGraphCanvas() {
      if (!graphCtx) return;
      
      graphCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
      
      // Draw edges
      graphCtx.lineWidth = 3;
      graphCtx.strokeStyle = 'rgba(102, 126, 234, 0.4)';
      
      for (const edge of graphEdges) {
        const fromNode = graphNodes[edge.from];
        const toNode = graphNodes[edge.to];
        
        if (edge.highlighted) {
          graphCtx.strokeStyle = 'rgba(17, 153, 142, 0.8)';
          graphCtx.lineWidth = 5;
        } else {
          graphCtx.strokeStyle = 'rgba(102, 126, 234, 0.4)';
          graphCtx.lineWidth = 3;
        }
        
        graphCtx.beginPath();
        graphCtx.moveTo(fromNode.x, fromNode.y);
        graphCtx.lineTo(toNode.x, toNode.y);
        graphCtx.stroke();
        
        // Draw weight if weighted graph
        if (isWeighted && edge.weight) {
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          
          graphCtx.fillStyle = 'white';
          graphCtx.fillRect(midX - 15, midY - 12, 30, 24);
          
          graphCtx.fillStyle = '#667eea';
          graphCtx.font = 'bold 14px Arial';
          graphCtx.textAlign = 'center';
          graphCtx.textBaseline = 'middle';
          graphCtx.fillText(edge.weight, midX, midY);
        }
      }
      
      // Draw nodes
      for (const node of graphNodes) {
        let gradient;
        
        if (node.state === 'current') {
          gradient = graphCtx.createLinearGradient(node.x - 25, node.y - 25, node.x + 25, node.y + 25);
          gradient.addColorStop(0, '#ffd89b');
          gradient.addColorStop(1, '#ff6347');
        } else if (node.state === 'visited') {
          gradient = graphCtx.createLinearGradient(node.x - 25, node.y - 25, node.x + 25, node.y + 25);
          gradient.addColorStop(0, '#56ccf2');
          gradient.addColorStop(1, '#2f80ed');
        } else if (node.state === 'path') {
          gradient = graphCtx.createLinearGradient(node.x - 25, node.y - 25, node.x + 25, node.y + 25);
          gradient.addColorStop(0, '#11998e');
          gradient.addColorStop(1, '#38ef7d');
        } else {
          gradient = graphCtx.createLinearGradient(node.x - 25, node.y - 25, node.x + 25, node.y + 25);
          gradient.addColorStop(0, '#667eea');
          gradient.addColorStop(1, '#764ba2');
        }
        
        graphCtx.fillStyle = gradient;
        graphCtx.beginPath();
        graphCtx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
        graphCtx.fill();
        
        graphCtx.strokeStyle = 'white';
        graphCtx.lineWidth = 3;
        graphCtx.stroke();
        
        graphCtx.fillStyle = 'white';
        graphCtx.font = 'bold 18px Arial';
        graphCtx.textAlign = 'center';
        graphCtx.textBaseline = 'middle';
        graphCtx.fillText(node.id, node.x, node.y);
      }
    }

    function resetGraphStates() {
      for (const node of graphNodes) {
        node.state = 'unvisited';
      }
      for (const edge of graphEdges) {
        edge.highlighted = false;
      }
      drawGraphCanvas();
    }

    function resetGraph() {
      resetGraphStates();
      document.getElementById('graph-algo-info').classList.remove('show');
    }

    function showGraphAlgoInfo(type) {
      const info = document.getElementById('graph-algo-info');
      const messages = {
        bfs: '🔄 BFS: Explores level by level using a queue',
        dfs: '🔄 DFS: Explores as deep as possible using a stack',
        dijkstra: '🔄 Dijkstra: Finds shortest path in weighted graphs',
        astar: '🔄 A*: Optimized pathfinding using heuristics'
      };
      info.textContent = messages[type];
      info.classList.add('show');
    }

    function disableGraphButtons() {
      document.getElementById('btn-bfs').disabled = true;
      document.getElementById('btn-dfs').disabled = true;
      document.getElementById('btn-dijkstra').disabled = true;
      document.getElementById('btn-astar').disabled = true;
      document.getElementById('btn-reset').disabled = true;
    }

    function enableGraphButtons() {
      document.getElementById('btn-bfs').disabled = false;
      document.getElementById('btn-dfs').disabled = false;
      document.getElementById('btn-dijkstra').disabled = !isWeighted;
      document.getElementById('btn-astar').disabled = !isWeighted;
      document.getElementById('btn-reset').disabled = false;
    }

    async function startBFS() {
      if (isRunning || !graph) return;
      const startNode = parseInt(document.getElementById('start-node').value);
      
      if (isNaN(startNode) || !graph.hasOwnProperty(startNode)) {
        alert('Invalid start node!');
        return;
      }
      
      isRunning = true;
      disableGraphButtons();
      resetGraphStates();
      showGraphAlgoInfo('bfs');
      
      await bfs(startNode);
      
      enableGraphButtons();
      isRunning = false;
    }

    async function bfs(start) {
      const visited = new Set();
      const queue = [start];
      visited.add(start);
      
      while (queue.length > 0) {
        const current = queue.shift();
        graphNodes[current].state = 'current';
        drawGraphCanvas();
        await new Promise(r => setTimeout(r, 800));
        
        graphNodes[current].state = 'visited';
        
        for (const neighbor of graph[current]) {
          const nextNode = neighbor.node;
          if (!visited.has(nextNode)) {
            visited.add(nextNode);
            queue.push(nextNode);
          }
        }
        
        drawGraphCanvas();
        await new Promise(r => setTimeout(r, 400));
      }
    }

    async function startDFS() {
      if (isRunning || !graph) return;
      const startNode = parseInt(document.getElementById('start-node').value);
      
      if (isNaN(startNode) || !graph.hasOwnProperty(startNode)) {
        alert('Invalid start node!');
        return;
      }
      
      isRunning = true;
      disableGraphButtons();
      resetGraphStates();
      showGraphAlgoInfo('dfs');
      
      const visited = new Set();
      await dfs(startNode, visited);
      
      enableGraphButtons();
      isRunning = false;
    }

    async function dfs(node, visited) {
      visited.add(node);
      graphNodes[node].state = 'current';
      drawGraphCanvas();
      await new Promise(r => setTimeout(r, 800));
      
      graphNodes[node].state = 'visited';
      drawGraphCanvas();
      await new Promise(r => setTimeout(r, 400));
      
      for (const neighbor of graph[node]) {
        const nextNode = neighbor.node;
        if (!visited.has(nextNode)) {
          await dfs(nextNode, visited);
        }
      }
    }

    async function startDijkstra() {
      if (isRunning || !graph || !isWeighted) return;
      const startNode = parseInt(document.getElementById('start-node').value);
      const endNode = parseInt(document.getElementById('end-node').value);
      
      if (isNaN(startNode) || !graph.hasOwnProperty(startNode) || 
          isNaN(endNode) || !graph.hasOwnProperty(endNode)) {
        alert('Invalid start or end node!');
        return;
      }
      
      isRunning = true;
      disableGraphButtons();
      resetGraphStates();
      showGraphAlgoInfo('dijkstra');
      
      await dijkstra(startNode, endNode);
      
      enableGraphButtons();
      isRunning = false;
    }

    async function dijkstra(start, end) {
      const distances = {};
      const previous = {};
      const unvisited = new Set();
      
      for (const node in graph) {
        distances[node] = Infinity;
        previous[node] = null;
        unvisited.add(parseInt(node));
      }
      distances[start] = 0;
      
      while (unvisited.size > 0) {
        let current = null;
        let minDist = Infinity;
        
        for (const node of unvisited) {
          if (distances[node] < minDist) {
            minDist = distances[node];
            current = node;
          }
        }
        
        if (current === null || distances[current] === Infinity) break;
        
        unvisited.delete(current);
        graphNodes[current].state = 'current';
        drawGraphCanvas();
        await new Promise(r => setTimeout(r, 800));
        
        if (current === end) break;
        
        for (const neighbor of graph[current]) {
          const nextNode = neighbor.node;
          const newDist = distances[current] + neighbor.weight;
          
          if (newDist < distances[nextNode]) {
            distances[nextNode] = newDist;
            previous[nextNode] = current;
          }
        }
        
        graphNodes[current].state = 'visited';
        drawGraphCanvas();
        await new Promise(r => setTimeout(r, 400));
      }
      
      // Reconstruct path
      const path = [];
      let current = end;
      while (current !== null) {
        path.unshift(current);
        current = previous[current];
      }
      
      // Highlight path
      if (path.length > 1 && path[0] === start) {
        for (let i = 0; i < path.length; i++) {
          graphNodes[path[i]].state = 'path';
          
          if (i > 0) {
            const from = path[i - 1];
            const to = path[i];
            for (const edge of graphEdges) {
              if ((edge.from === from && edge.to === to) || 
                  (edge.from === to && edge.to === from)) {
                edge.highlighted = true;
              }
            }
          }
          
          drawGraphCanvas();
          await new Promise(r => setTimeout(r, 500));
        }
      }
    }

    async function startAStar() {
      if (isRunning || !graph || !isWeighted) return;
      const startNode = parseInt(document.getElementById('start-node').value);
      const endNode = parseInt(document.getElementById('end-node').value);
      
      if (isNaN(startNode) || !graph.hasOwnProperty(startNode) || 
          isNaN(endNode) || !graph.hasOwnProperty(endNode)) {
        alert('Invalid start or end node!');
        return;
      }
      
      isRunning = true;
      disableGraphButtons();
      resetGraphStates();
      showGraphAlgoInfo('astar');
      
      await aStar(startNode, endNode);
      
      enableGraphButtons();
      isRunning = false;
    }

    function heuristic(node1, node2) {
      const dx = graphNodes[node1].x - graphNodes[node2].x;
      const dy = graphNodes[node1].y - graphNodes[node2].y;
      return Math.sqrt(dx * dx + dy * dy) / 100;
    }

    async function aStar(start, end) {
      const openSet = new Set([start]);
      const closedSet = new Set();
      const gScore = {};
      const fScore = {};
      const previous = {};
      
      for (const node in graph) {
        gScore[node] = Infinity;
        fScore[node] = Infinity;
        previous[node] = null;
      }
      gScore[start] = 0;
      fScore[start] = heuristic(start, end);
      
      while (openSet.size > 0) {
        let current = null;
        let minF = Infinity;
        
        for (const node of openSet) {
          if (fScore[node] < minF) {
            minF = fScore[node];
            current = node;
          }
        }
        
        if (current === null) break;
        
        graphNodes[current].state = 'current';
        drawGraphCanvas();
        await new Promise(r => setTimeout(r, 800));
        
        if (current === end) {
          // Reconstruct path
          const path = [];
          let curr = end;
          while (curr !== null) {
            path.unshift(curr);
            curr = previous[curr];
          }
          
          for (let i = 0; i < path.length; i++) {
            graphNodes[path[i]].state = 'path';
            
            if (i > 0) {
              const from = path[i - 1];
              const to = path[i];
              for (const edge of graphEdges) {
                if ((edge.from === from && edge.to === to) || 
                    (edge.from === to && edge.to === from)) {
                  edge.highlighted = true;
                }
              }
            }
            
            drawGraphCanvas();
            await new Promise(r => setTimeout(r, 500));
          }
          return;
        }
        
        openSet.delete(current);
        closedSet.add(current);
        graphNodes[current].state = 'visited';
        
        for (const neighbor of graph[current]) {
          const nextNode = neighbor.node;
          
          if (closedSet.has(nextNode)) continue;
          
          const tentativeG = gScore[current] + neighbor.weight;
          
          if (!openSet.has(nextNode)) {
            openSet.add(nextNode);
          } else if (tentativeG >= gScore[nextNode]) {
            continue;
          }
          
          previous[nextNode] = current;
          gScore[nextNode] = tentativeG;
          fScore[nextNode] = gScore[nextNode] + heuristic(nextNode, end);
        }
        
        drawGraphCanvas();
        await new Promise(r => setTimeout(r, 400));
      }
    }

    // Initialize with tree view
    showTree();