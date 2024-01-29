import { For, createSignal, createEffect, Show } from "solid-js";
type Id = string;
export type ObjectNode = {
  id: Id;
  description: string;
  parent: Id;
  children: Id[];
  relations: Id[];
};

export type RelationNode = {
  id: Id;
  description: string;
  members: Id[];
};

export type ObjectComponentProps = {
  object: ObjectNode;
  onNodeClick: (nodeId: Id) => void;
};

export function ObjectNodeComponent(props: ObjectComponentProps) {
  return (
    <div>
      <p>
        {props.object.id}: {props.object.description}
      </p>
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "margin-bottom": "10px",
        }}
      >
        <span>Parent: </span>
        <button
          onClick={() => props.onNodeClick(props.object.parent)}
          aria-label={props.object.parent}
          disabled={!props.object.parent}
          style={{ "margin-left": "10px" }}
        >
          {props.object.parent || "None"}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "margin-bottom": "10px",
        }}
      >
        <span>Children: </span>
        <div
          style={{
            display: "flex",
            "flex-wrap": "wrap",
            "margin-left": "10px",
          }}
        >
          <For each={props.object.children}>
            {(child) => (
              <button
                onClick={() => props.onNodeClick(child)}
                aria-label={child}
                style={{ "margin-right": "5px", "margin-bottom": "5px" }}
              >
                {child}
              </button>
            )}
          </For>
          {props.object.children.length === 0 && <span>None</span>}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "margin-bottom": "10px",
        }}
      >
        <span>Relations: </span>
        <div
          style={{
            display: "flex",
            "flex-wrap": "wrap",
            "margin-left": "10px",
          }}
        >
          <For each={props.object.relations}>
            {(relation) => (
              <button
                onClick={() => props.onNodeClick(relation)}
                aria-label={relation}
                style={{ "margin-right": "5px", "margin-bottom": "5px" }}
              >
                {relation}
              </button>
            )}
          </For>
          {props.object.relations.length === 0 && <span>None</span>}
        </div>
      </div>
    </div>
  );
}

export type RelationComponentProps = {
  relation: RelationNode;
  onMemberClick: (member: Id) => void;
};

export function RelationNodeComponent(props: RelationComponentProps) {
  return (
    <div>
      <p>
        {props.relation.id}: {props.relation.description}
      </p>
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "flex-wrap": "wrap",
        }}
      >
        <span>Members: </span>
        <div
          style={{
            display: "flex",
            "flex-wrap": "wrap",
            "margin-left": "10px",
          }}
        >
          <For each={props.relation.members}>
            {(member) => (
              <button
                onClick={() => props.onMemberClick(member)}
                aria-label={member}
                style={{ "margin-left": "5px", "margin-bottom": "5px" }}
              >
                {member}
              </button>
            )}
          </For>
          {props.relation.members.length === 0 && <span>None</span>}
        </div>
      </div>
    </div>
  );
}

export type TraverseObjRelComponentProps = {
  nodes: (ObjectNode | RelationNode)[];
};
export function TraverseObjRelComponent(props: TraverseObjRelComponentProps) {
  const [currentNodeId, setCurrentNodeId] = createSignal(props.nodes[0].id); // Root node's ID as initial state
  const nodeMap = new Map();

  // Separate and map the nodes
  props.nodes.forEach((node) => {
    nodeMap.set(node.id, node);
  });

  const onNodeClick = (nodeId: Id) => {
    setCurrentNodeId(nodeId);
  };

  // Determine the type of the current node and render accordingly
  const renderCurrentNode = () => {
    const currentNode = nodeMap.get(currentNodeId());
    if ("members" in currentNode) {
      // It's a RelationNode
      return (
        <RelationNodeComponent
          relation={currentNode}
          onMemberClick={onNodeClick}
        />
      );
    } else {
      // It's an ObjectNode
      return (
        <ObjectNodeComponent object={currentNode} onNodeClick={onNodeClick} />
      );
    }
  };

  return (
    <div>
      <Show when={nodeMap.has(currentNodeId())}>{renderCurrentNode()}</Show>
    </div>
  );
}
