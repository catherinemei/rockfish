import { createSignal, For } from "solid-js";

type Id = string;

export type Node = {
  id: Id;
  parents: Id[];
  children: Id[];
  description: string;
};

type TraversalGraph = { [uid: Id]: Node };

function calculateDefaultPaths(
  graph: TraversalGraph,
  rootNodeId: Id
): Map<Id, Id[]> {
  let paths = new Map<Id, Id[]>();
  let queue = [[rootNodeId]]; // Queue for BFS, starts with the path containing only the root

  while (queue.length > 0) {
    let path = queue.shift()!; // Non-null assertion

    let node = path[path.length - 1]; // The last node in the path

    // If this node hasn't been visited yet, or the new path is shorter, store the path
    if (!paths.has(node) || path.length < (paths.get(node) || []).length) {
      paths.set(node, path);
      if (graph[node] && graph[node].children) {
        graph[node].children.forEach((childId) => {
          queue.push([...path, childId]);
        });
      }
    }
  }

  return paths;
}

export const TraversalComponent = (props: { nodes: Node[] }) => {
  // Convert nodes array to TraversalGraph
  let rootId = "";
  const graph: TraversalGraph = props.nodes.reduce<TraversalGraph>(
    (acc, node) => {
      acc[node.id] = node;
      node.parents.length === 0 ? (rootId = node.id) : null;
      return acc;
    },
    {}
  );

  // State for the currently focused node
  const [focusedNodeId, setFocusedNodeId] = createSignal(props.nodes[0].id);

  // Stack to keep track of accessed nodes
  const [accessedNodes, setAccessedNodes] = createSignal([props.nodes[0].id]);

  const defaultPaths = calculateDefaultPaths(graph, rootId);

  // Function to update focused node and accessed nodes stack
  const updateFocus = (nodeId: Id) => {
    console.log("updateFocus:", graph[nodeId].description);
    const currentFocusedId = focusedNodeId();
    const newFocusedNode = graph[nodeId];
    const currentAccessedNodes = accessedNodes(); // Correctly accessing the value of the signal

    if (newFocusedNode.parents.includes(currentFocusedId)) {
      // If new node is a child, push it onto the stack
      setAccessedNodes([...currentAccessedNodes, nodeId]);
    } else if (newFocusedNode.id === currentFocusedId) {
      // If the new node is the same as the current, do nothing
    } else if (newFocusedNode.children.includes(currentFocusedId)) {
      // If new node is a parent, pop 2 from stack (child, old parent) and push the new node
      const lastAccessedNode =
        currentAccessedNodes[currentAccessedNodes.length - 2];
      if (!newFocusedNode.parents.includes(lastAccessedNode)) {
        // Take care of case where parents of previously focused node are not on same level
        const firstParent = newFocusedNode.parents[0];
        let defaultPath = defaultPaths.get(firstParent);
        defaultPath = defaultPath?.concat(newFocusedNode.id) || [
          newFocusedNode.id,
        ];
        setAccessedNodes(defaultPath);
      } else {
        setAccessedNodes(currentAccessedNodes.slice(0, -2).concat(nodeId));
      }
    } else {
      // If new node is a sibling, replace the current node with the new node on the stack
      setAccessedNodes(currentAccessedNodes.slice(0, -1).concat(nodeId));
    }
    setFocusedNodeId(nodeId);
    console.log("final accessed node state:", accessedNodes());
  };

  // Function to get parent, sibling, and children nodes
  const getGraphLayers = (): [Node[], Node[], Node[]] => {
    const focusedNode = graph[focusedNodeId()];
    const parents = focusedNode.parents.map((id) => graph[id]);

    let siblings: Node[] = [];
    const currentAccessedNodes = accessedNodes();
    const lastAccessedNode =
      currentAccessedNodes[currentAccessedNodes.length - 2];

    if (focusedNode.parents.length === 0) {
      siblings = [focusedNode]; // Root node case
    } else if (lastAccessedNode) {
      siblings = graph[lastAccessedNode].children.map((id) => graph[id]);
    } else {
      siblings = focusedNode.parents
        .flatMap((id) => graph[id].children)
        .map((id) => graph[id]);
    }

    const children = focusedNode.children.map((id) => graph[id]);
    return [parents, siblings, children];
  };

  const isFocusedNode = (nodeId: Id) => {
    return focusedNodeId() === nodeId;
  };

  const isCurrentParent = (nodeId: Id) => {
    const currentAccessedNodes = accessedNodes();
    const lastAccessedNode =
      currentAccessedNodes[currentAccessedNodes.length - 2];
    return nodeId === lastAccessedNode;
  };

  // Function to cycle through parents of the current focused node
  const cycleThroughParents = () => {
    const currentFocusedId = focusedNodeId();
    const focusedNode = graph[currentFocusedId];
    let currentAccessedNodes = accessedNodes();

    if (focusedNode.parents.length > 0) {
      // Find the index of the current parent in the parents array
      const currentParentIndex = focusedNode.parents.indexOf(
        currentAccessedNodes[currentAccessedNodes.length - 2]
      );
      const nextParentIndex =
        (currentParentIndex + 1) % focusedNode.parents.length;

      // Update the accessedNodes to set the next parent as the current parent
      const newAccessedNodes = [
        ...currentAccessedNodes.slice(0, -2),
        focusedNode.parents[nextParentIndex],
        currentFocusedId,
      ];
      setAccessedNodes(newAccessedNodes);
      console.log("final accessed node state:", accessedNodes());
    }
  };

  return (
    <div>
      <For each={["Parents", "Focused Node & Siblings", "Children"]}>
        {(layerLabel, index) => (
          <div
            style={{
              display: "grid",
              "grid-template-columns": "200px 1fr",
              "align-items": "center",
              gap: "10px",
              "min-height": "50px",
            }}
          >
            <div>
              <span style={{ "text-align": "right" }}>{layerLabel}</span>
              {layerLabel === "Parents" ? (
                <button onClick={cycleThroughParents}>
                  Change Parent Focus
                </button>
              ) : null}
            </div>
            <div
              style={{
                display: "grid",
                "grid-template-columns":
                  "repeat(auto-fill, minmax(100px, 1fr))",
                gap: "10px",
              }}
            >
              <For each={getGraphLayers()[index()]}>
                {(node) => (
                  <button
                    onClick={() => {
                      updateFocus(node.id);
                    }}
                    style={
                      isFocusedNode(node.id)
                        ? { "background-color": "lightskyblue" }
                        : isCurrentParent(node.id) && index() === 0 // Apply the style only to parent nodes
                        ? { "background-color": "lightblue" }
                        : {}
                    }
                  >
                    {node.description}
                  </button>
                )}
              </For>
              {getGraphLayers()[index()].length === 0 && (
                <span style={{ color: "grey" }}>None</span>
              )}
            </div>
          </div>
        )}
      </For>
    </div>
  );
};
