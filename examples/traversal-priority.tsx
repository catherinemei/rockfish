import { For, createSignal, Show, createMemo, createEffect } from "solid-js";
type Id = string;

export type PriorityNode = {
  id: Id;
  description: string;
  relations: RelationType[];
};

export type RelationType = {
  id: Id;
  priority: string;
};

export type PriorityNodeComponentProps = {
  node: PriorityNode;
  nodeMap: Map<string, PriorityNode>;
  onRelationClick: (id: string) => void;
};

export function PriorityNodeComponent(props: PriorityNodeComponentProps) {
  const groupedRelations = createMemo(() => {
    const groups: Record<string, RelationType[]> = {};
    props.node.relations.forEach((relation) => {
      if (!groups[relation.priority]) {
        groups[relation.priority] = [];
      }
      groups[relation.priority].push(relation);
    });
    return groups;
  });

  return (
    <div style="padding-left: 50px;">
      <p style="font-weight:bold;">{props.node.description}</p>
      <For each={Object.entries(groupedRelations())}>
        {([priority, relations]) => (
          <div
            style={{
              display: "flex",
              "align-items": "center",
              "margin-bottom": "10px",
            }}
          >
            <span>{priority}: </span>
            <div
              style={{
                display: "flex",
                "flex-wrap": "wrap",
                "margin-left": "10px",
              }}
            >
              <For each={relations}>
                {(relation) => (
                  <button
                    onClick={() => props.onRelationClick(relation.id)}
                    aria-label={relation.id}
                    style={{ "margin-right": "5px", "margin-bottom": "5px" }}
                  >
                    {props.nodeMap.get(relation.id)?.description || relation.id}
                  </button>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

// Go through scenegraph and make a map/graph
// for each node in the scenegraph, make an entry in the graph
// Go through map/graph again - add parent child relations
// Valid parent child relationship if child does not have its children as all refs (i.e. parent of an object)
// for nodes where children are all refs -> inline as relation with some priority in traversal structure
export function parseScenegraphToNodeMap(scenegraph: {
  [key: string]: any;
}): [Map<string, PriorityNode>, string] {
  const nodes = new Map<string, any>();
  let [rootNode, scenegraphNodes] = Object.entries(scenegraph)[0];

  // Extract all nodes from scenegraph
  for (const scenegraphNodeId in scenegraphNodes) {
    const scenegraphNodeVal = scenegraphNodes[scenegraphNodeId];
    nodes.set(scenegraphNodeId, scenegraphNodeVal);
  }

  const nodesWithRefChildren = new Map<string, boolean>();
  nodes.forEach((node, nodeId) => {
    if (node.type === "ref") {
      nodesWithRefChildren.set(nodeId, true);
    } else {
      let setToTrue = false;
      node.children.forEach((childId: string) => {
        const childNode = nodes.get(childId);
        if (childNode.type === "ref") {
          nodesWithRefChildren.set(nodeId, true);
          setToTrue = true;
        }
      });
      if (!setToTrue) {
        nodesWithRefChildren.set(nodeId, false);
      }
    }
  });

  console.log("nodesWithRefChildren:", nodesWithRefChildren);
  const nodeMap = new Map<string, PriorityNode>();

  // Go through each node and process to make it into PriorityNode format
  nodes.forEach((node, nodeId) => {
    // Skip refs - they do not show up in node map
    if (node.type === "ref") {
      // skip ref nodes
    } else if (nodesWithRefChildren.get(nodeId)) {
      // Nodes with refs as children should be relations that are inlined in other nodes
      // For each child that current node references, add current node as relation in child node
      // Children should be refs

      // For each child (each ref that's in relation)
      // Need to add a relation to all of other nodes in this relation for that child

      const actualChildrenIds = node.children.map((elmId: string) => {
        const refNode = nodes.get(elmId);
        const nodeIdRefPointsTo = refNode.refId;
        return nodeIdRefPointsTo;
      });

      actualChildrenIds.forEach((childId: string) => {
        const childNode = nodeMap.get(childId);

        actualChildrenIds.forEach((otherChildId: string) => {
          if (childId !== otherChildId && childNode) {
            childNode.relations.push({
              id: otherChildId,
              priority: nodeId,
            });
          }
        });
      });
    } else {
      // Regular nodes
      const relations: RelationType[] = [];

      // Add parent if there is one
      if (node.parent) {
        relations.push({ id: node.parent, priority: "Contained by (parent)" });
      }

      node.children.forEach((childId: string) => {
        if (!nodesWithRefChildren.get(childId)) {
          // Add each child that is not an inlined relation
          relations.push({ id: childId, priority: "Contains (child)" });
        }
      });

      nodeMap.set(nodeId, {
        id: nodeId,
        description: node.customData["aria-label"] ?? nodeId,
        relations: relations,
      });
    }
  });

  return [nodeMap, rootNode];
}

export type TraversePriorityComponentProps = {
  nodes: PriorityNode[];
  visualizeGraph?: boolean;
  useHardCodedGraph?: boolean;
};
export function TraversePriorityComponent(
  props: TraversePriorityComponentProps
) {
  const [scenegraph, setScenegraph] = createSignal({});
  const [currentNodeId, setCurrentNodeId] = createSignal(props.nodes[0].id); // Root node's ID as initial state
  const [nodeMap, setNodeMap] = createSignal(new Map<string, PriorityNode>()); // Map of nodes

  // Watch for changes in window.bluefish and update scenegraph signal
  createEffect(() => {
    if (window.bluefish) {
      setScenegraph(window.bluefish);
    }
  });

  // React to changes in scenegraph
  createEffect(() => {
    if (props.useHardCodedGraph) {
      const tempNodeMap = new Map();
      props.nodes.forEach((node) => {
        tempNodeMap.set(node.id, node);
      });
      setNodeMap(tempNodeMap);
    } else {
      const currentScenegraph = scenegraph();
      if (Object.keys(currentScenegraph).length > 0) {
        let [tempNodeMap, rootNode] =
          parseScenegraphToNodeMap(currentScenegraph);
        setNodeMap(tempNodeMap);
        setCurrentNodeId(rootNode);
      }
    }
  });

  const onNodeClick = (nodeId: string) => {
    setCurrentNodeId(nodeId);
  };

  // Render the current node
  const renderCurrentNode = () => {
    const currentNode = nodeMap().get(currentNodeId());
    if (currentNode) {
      return (
        <PriorityNodeComponent
          node={currentNode}
          nodeMap={nodeMap()}
          onRelationClick={onNodeClick}
        />
      );
    }
    return <div>Encountered an error: Node not found</div>; // Fallback UI
  };

  return (
    <div>
      <Show when={nodeMap().has(currentNodeId())}>{renderCurrentNode()}</Show>
    </div>
  );
}
