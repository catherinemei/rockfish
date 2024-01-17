import { createEffect, createSignal, For } from "solid-js";
import { GraphVisualizer } from "./traversal-target";

type Id = string;

export type Node = {
  id: Id;
  parents: Id[];
  children: Id[];
  description: string;
};

export type TraversalGraph = { [uid: Id]: Node };

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

export function parseScenegraphToTraversalGraph(scenegraph: {
  [key: string]: any;
}): [TraversalGraph, string] {
  let graph: TraversalGraph = {};

  let [rootNode, scenegraphNodes] = Object.entries(scenegraph)[0];
  let rootId = rootNode;

  for (const scenegraphNodeId in scenegraphNodes) {
    const scenegraphNodeVal = scenegraphNodes[scenegraphNodeId];
    if (scenegraphNodeVal.type === "ref") {
      const fromId = scenegraphNodeVal.parent;
      const toId = scenegraphNodeVal.refId;
      graph[fromId].children.push(toId);
      graph[toId].parents.push(fromId);

      // Remove the ref node from the graph
      graph[fromId].children = graph[fromId].children.filter(
        (id) => id !== scenegraphNodeId
      );
      graph[toId].parents = graph[toId].parents.filter(
        (id) => id !== scenegraphNodeId
      );
    } else {
      const node: Node = {
        id: scenegraphNodeId,
        parents: [],
        children: [],
        description:
          scenegraphNodeVal.customData["aria-label"] ?? scenegraphNodeId,
      };
      if (scenegraphNodeVal["children"]) {
        node.children = scenegraphNodeVal["children"].map(
          (child: any) => child
        );
      }
      if (scenegraphNodeVal["parent"]) {
        node.parents.push(scenegraphNodeVal["parent"]);
      }
      graph[scenegraphNodeId] = node;
    }
  }

  return [graph, rootId];
}

export type TraversalProps = {
  visualizeGraph?: boolean;
};

export const TraversalComponent = (props: TraversalProps) => {
  const [graph, setGraph] = createSignal<TraversalGraph>({});
  const [rootId, setRootId] = createSignal<string>("0");
  const [scenegraph, setScenegraph] = createSignal({});
  const [defaultPaths, setDefaultPaths] = createSignal<Map<Id, Id[]>>(
    new Map()
  );

  // State for the currently focused node
  const [focusedNodeId, setFocusedNodeId] = createSignal<string>(rootId());

  // Stack to keep track of accessed nodes
  const [accessedNodes, setAccessedNodes] = createSignal([rootId()]);

  // Watch for changes in window.bluefish and update scenegraph signal
  createEffect(() => {
    if (window.bluefish) {
      setScenegraph(window.bluefish);
    }
  });

  // React to changes in scenegraph
  createEffect(() => {
    const currentScenegraph = scenegraph();
    if (Object.keys(currentScenegraph).length > 0) {
      let [outputGraph, outputRootId] =
        parseScenegraphToTraversalGraph(currentScenegraph);
      setGraph(outputGraph);
      setRootId(outputRootId);
      setFocusedNodeId(outputRootId);
      setAccessedNodes([outputRootId]);
      let curDefaultPaths = calculateDefaultPaths(outputGraph, outputRootId);
      setDefaultPaths(curDefaultPaths);
    }
  });

  const updateFocus = (nodeId: Id) => {
    console.log("updateFocus:", graph()[nodeId].description);
    const newFocusedNode = graph()[nodeId];
    const currentAccessedNodes = accessedNodes();

    if (
      newFocusedNode.parents.includes(
        currentAccessedNodes[currentAccessedNodes.length - 1]
      )
    ) {
      // If new node is a child, push it onto the stack
      setAccessedNodes([...currentAccessedNodes, nodeId]);
    } else {
      // Find the closest common ancestor in the accessedNodes stack
      let commonAncestorIndex = -1;
      for (let i = currentAccessedNodes.length - 1; i >= 0; i--) {
        if (newFocusedNode.parents.includes(currentAccessedNodes[i])) {
          commonAncestorIndex = i;
          break;
        }
      }

      if (commonAncestorIndex !== -1) {
        // Update the stack up to the common ancestor and then add the new node
        setAccessedNodes([
          ...currentAccessedNodes.slice(0, commonAncestorIndex + 1),
          nodeId,
        ]);
      } else {
        // If there's no common ancestor, reset the stack
        setAccessedNodes(defaultPaths().get(nodeId) || [nodeId]);
      }
    }

    setFocusedNodeId(nodeId);
    console.log("final accessed node state:", accessedNodes());
    console.log("------------------------");
  };

  // Function to get parent, sibling, and children nodes
  const getGraphLayers = (): [Node[], Node[], Node[]] => {
    const currentFocusedId = focusedNodeId();
    const focusedNode = graph()[currentFocusedId];

    if (!focusedNode) {
      return [[], [], []]; // Return empty arrays if the focusedNode is not found
    }

    const parents = focusedNode.parents.map((id) => graph()[id]);

    let siblings: Node[] = [];
    const currentAccessedNodes = accessedNodes();
    const lastAccessedNode =
      currentAccessedNodes[currentAccessedNodes.length - 2];

    if (focusedNode.parents.length === 0) {
      siblings = [focusedNode]; // Root node case
    } else if (lastAccessedNode) {
      siblings = graph()[lastAccessedNode].children.map((id) => graph()[id]);
    } else {
      siblings = focusedNode.parents
        .flatMap((id) => graph()[id].children)
        .map((id) => graph()[id]);
    }

    const children = focusedNode.children.map((id) => graph()[id]);
    return [parents, siblings, children];
  };

  const isFocusedNode = (nodeId: Id) => {
    return focusedNodeId() === nodeId;
  };

  const isCurrentParent = (nodeId: Id) => {
    const currentAccessedNodes = accessedNodes();
    const currentFocusedId = focusedNodeId();
    const focusedNode = graph()[currentFocusedId];

    return (
      focusedNode.parents.includes(nodeId) &&
      currentAccessedNodes.includes(nodeId)
    );
  };

  // Function to cycle through parents of the current focused node
  const cycleThroughParents = () => {
    const currentFocusedId = focusedNodeId();
    const focusedNode = graph()[currentFocusedId];
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
      {props.visualizeGraph ? <GraphVisualizer travGraph={graph()} /> : null}
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
