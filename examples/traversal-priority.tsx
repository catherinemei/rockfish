import { For, createSignal, Show, createMemo, createEffect } from "solid-js";
import { PriorityGraphVisualizer } from "./traversal-priority-target";
type Id = string;

export type PriorityNode = {
  id: Id;
  displayName: string;
  description?: string;
  relations: RelationType[];
};

export type RelationType = {
  relatedNodeId: Id; // id of node in relation with current node
  relationDisplayName: string;
  relationId: Id;
  priorityLevel?: number;
};

export type PriorityNodeComponentProps = {
  node: PriorityNode;
  nodeMap: Map<string, PriorityNode>;
  onRelationClick: (id: string) => void;
  priorityRankings: Record<string, number>;
  priorityDisplayNames: Record<string, string>;
};

export function PriorityNodeComponent(props: PriorityNodeComponentProps) {
  // For each priority node, groups relations by category
  // Returns these groupings; each group contains all relations with the same priority
  const groupedRelations = createMemo(() => {
    const groups: Record<string, RelationType[]> = {};
    props.node.relations.forEach((relation) => {
      if (!groups[relation.relationId]) {
        groups[relation.relationId] = [];
      }
      groups[relation.relationId].push(relation);
    });

    // Sort the groups based on priority rankings using priorityLevel
    const sortedGroups = Object.entries(groups).sort((a, b) => {
      const priorityA = props.priorityRankings[a[0]] || 0; // Fallback to 0 if not provided
      const priorityB = props.priorityRankings[b[0]] || 0; // Fallback to 0 if not provided
      return priorityA - priorityB;
    });

    // Convert the sorted array back to an object
    const sortedGroupsObject: Record<string, RelationType[]> = {};
    sortedGroups.forEach(([priority, relations]) => {
      sortedGroupsObject[priority] = relations;
    });

    return sortedGroupsObject;
  });

  return (
    <div
      style="padding-left: 50px;"
      aria-label={`You are on the ${props.node.displayName} node; ${props.node.description}. Enter this node to access the relations of this node`}
    >
      <p style="font-weight:bold;" aria-hidden={true}>
        {props.node.displayName}
      </p>
      <p style="font-style:italic;" aria-hidden={true}>
        {props.node.description}
      </p>
      <For each={Object.entries(groupedRelations())}>
        {([priorityId, relations]) => (
          <div
            style={{
              display: "flex",
              "align-items": "center",
              "margin-bottom": "10px",
            }}
            aria-label={`You are on a ${props.priorityDisplayNames[priorityId]} relation. Enter the group to access members of this relation`}
          >
            <span aria-hidden={true}>
              {props.priorityDisplayNames[priorityId]}
            </span>
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
                    onClick={() =>
                      props.onRelationClick(relation.relatedNodeId)
                    }
                    aria-label={`${
                      props.nodeMap.get(relation.relatedNodeId)?.displayName ||
                      relation.relatedNodeId
                    }. Navigate to the ${
                      props.nodeMap.get(relation.relatedNodeId)?.displayName ||
                      relation.relatedNodeId
                    } node, which is related to the current ${
                      props.node.displayName
                    } node through a ${
                      props.priorityDisplayNames[priorityId]
                    } relation`}
                    style={{ "margin-right": "5px", "margin-bottom": "5px" }}
                  >
                    {props.nodeMap.get(relation.relatedNodeId)?.displayName ||
                      relation.relatedNodeId}
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

export type PriorityRankingInputProps = {
  priorityRankings: Record<string, number>;
  setPriorityRankings: (newRankings: Record<string, number>) => void;
  priorityDisplayNames: Record<string, string>;
};

export function PriorityRankingInput(props: PriorityRankingInputProps) {
  const handlePriorityChange = (priorityName: string, value: string) => {
    props.setPriorityRankings({
      ...props.priorityRankings,
      [priorityName]: parseInt(value) || 0,
    });
  };

  return (
    <div aria-hidden>
      <For each={Object.keys(props.priorityRankings)}>
        {(priorityId) => (
          <div aria-hidden>
            <label aria-hidden>
              {props.priorityDisplayNames[priorityId]}:{" "}
            </label>
            <input
              aria-hidden
              type="number"
              value={props.priorityRankings[priorityId]}
              onInput={(e) =>
                handlePriorityChange(priorityId, e.currentTarget.value)
              }
            />
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
}): [Map<string, PriorityNode>, string, PriorityNode[]] {
  const nodes = new Map<string, any>();
  const nodesOnly: PriorityNode[] = [];
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
              relatedNodeId: otherChildId,
              relationDisplayName:
                node.customData["aria-data"]?.displayName ?? nodeId,
              relationId: nodeId,
              priorityLevel: 2,
            });
          }
        });
      });
    } else {
      // Regular nodes
      const relations: RelationType[] = [];

      // Add parent if there is one
      if (node.parent) {
        relations.push({
          relatedNodeId: node.parent,
          relationDisplayName: "Parent",
          relationId: "parent",
          priorityLevel: 0,
        });
      }

      node.children.forEach((childId: string) => {
        if (!nodesWithRefChildren.get(childId)) {
          // Add each child that is not an inlined relation
          relations.push({
            relatedNodeId: childId,
            relationDisplayName: "Child",
            relationId: "child",
            priorityLevel: 1,
          });
        }
      });

      nodeMap.set(nodeId, {
        id: nodeId,
        displayName: node.customData["aria-data"]?.displayName ?? nodeId,
        description: node.customData["aria-data"]?.description ?? "",
        relations: relations,
      });
    }
  });

  // Go through nodeMap and extract the nodes only (without id field) and push to nodesOnly
  nodeMap.forEach((node) => {
    nodesOnly.push(node);
  });

  return [nodeMap, rootNode, nodesOnly];
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
  const [nodeListForVisual, setNodeList] = createSignal<PriorityNode[]>([]);
  const [priorityRankings, setPriorityRankings] = createSignal<
    Record<string, number>
  >({});
  const [priorityDisplayNames, setPriorityDisplayNames] = createSignal<
    Record<string, string>
  >({});

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
        let [tempNodeMap, rootNode, tempNodeList] =
          parseScenegraphToNodeMap(currentScenegraph);
        setNodeMap(tempNodeMap);
        setCurrentNodeId(rootNode);
        setNodeList(tempNodeList);

        // Create a map of relation type : priority level
        // Allows for sorting of relations based on priority level
        const newPriorityRankings: Record<string, number> = {};
        const newPriorityDisplayNames: Record<string, string> = {};
        tempNodeMap.forEach((node) => {
          node.relations.forEach((relation) => {
            newPriorityRankings[relation.relationId] =
              relation.priorityLevel || 0;
            newPriorityDisplayNames[relation.relationId] =
              relation.relationDisplayName;
          });
        });
        setPriorityRankings(newPriorityRankings);
        setPriorityDisplayNames(newPriorityDisplayNames);
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
          priorityRankings={priorityRankings()}
          priorityDisplayNames={priorityDisplayNames()}
        />
      );
    }
    return <div>Encountered an error: Node not found</div>; // Fallback UI
  };

  return (
    <div>
      {props.visualizeGraph ? (
        <PriorityGraphVisualizer priorityNode={nodeListForVisual()} />
      ) : null}
      <Show when={nodeMap().has(currentNodeId())}>{renderCurrentNode()}</Show>
      {/* <PriorityRankingInput
        priorityRankings={priorityRankings()}
        setPriorityRankings={setPriorityRankings}
        priorityDisplayNames={priorityDisplayNames()}
      /> */}
    </div>
  );
}
