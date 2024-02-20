import { For, createSignal, Show, createMemo } from "solid-js";
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

export type TraversePriorityComponentProps = {
  nodes: PriorityNode[];
  visualizeGraph?: boolean;
  otherGraph?: any[];
};
export function TraversePriorityComponent(
  props: TraversePriorityComponentProps
) {
  const [currentNodeId, setCurrentNodeId] = createSignal(props.nodes[0].id); // Root node's ID as initial state
  const nodeMap = new Map();

  // Separate and map the nodes
  props.nodes.forEach((node) => {
    nodeMap.set(node.id, node);
  });

  const onNodeClick = (nodeId: string) => {
    setCurrentNodeId(nodeId);
  };

  // Render the current node
  const renderCurrentNode = () => {
    const currentNode = nodeMap.get(currentNodeId());
    return (
      <PriorityNodeComponent
        node={currentNode}
        nodeMap={nodeMap}
        onRelationClick={onNodeClick}
      />
    );
  };

  return (
    <div>
      <Show when={nodeMap.has(currentNodeId())}>{renderCurrentNode()}</Show>
    </div>
  );
}
