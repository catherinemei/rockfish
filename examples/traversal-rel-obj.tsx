import { For, createSignal, Show } from "solid-js";
import { RelObjGraphVisualizer } from "./traversal-rel-obj-target";
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
  nodeMap: Map<Id, ObjectNode | RelationNode>;
  onNodeClick: (nodeId: Id) => void;
};

export function ObjectNodeComponent(props: ObjectComponentProps) {
  const renderRelationButton = (relationId: Id) => {
    const relation = props.nodeMap.get(relationId) as RelationNode;
    if (relation && relation.members && relation.members.length === 2) {
      // Find the other member in the relation
      const otherMemberId: Id =
        relation.members.find((member) => member !== props.object.id) || "";
      return (
        <button
          onClick={() => props.onNodeClick(otherMemberId)}
          aria-label={otherMemberId}
          style={{ "margin-right": "5px", "margin-bottom": "5px" }}
        >
          {relation.description} connects to{" "}
          {props.nodeMap.get(otherMemberId)?.description || otherMemberId}
        </button>
      );
    } else {
      // Render a button for the relation itself
      return (
        <button
          onClick={() => props.onNodeClick(relationId)}
          aria-label={relationId}
          style={{ "margin-right": "5px", "margin-bottom": "5px" }}
        >
          {relation?.description || relationId}
        </button>
      );
    }
  };

  return (
    <div style="padding-left: 50px;">
      <p style="font-weight:bold;">{props.object.description}</p>
      <div
        style={{
          display: "flex",
          "align-items": "center",
          "margin-bottom": "10px",
        }}
      >
        <span>Parent:</span>
        <div
          style={{
            display: "flex",
            "flex-wrap": "wrap",
            "margin-left": "10px",
          }}
        >
          {props.nodeMap.get(props.object.parent)?.description ? (
            <button
              onClick={() => props.onNodeClick(props.object.parent)}
              aria-label={props.object.parent}
            >
              {props.nodeMap.get(props.object.parent)?.description}
            </button>
          ) : (
            <span style={{ color: "grey" }}> None</span>
          )}
        </div>
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
                {props.nodeMap.get(child)?.description || child}
              </button>
            )}
          </For>
          {props.object.children.length === 0 && (
            <span style={{ color: "grey" }}>None</span>
          )}
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
            {(relationId) => renderRelationButton(relationId)}
          </For>
          {props.object.relations.length === 0 && (
            <span style={{ color: "grey" }}>None</span>
          )}
        </div>
      </div>
    </div>
  );
}

export type RelationComponentProps = {
  relation: RelationNode;
  nodeMap: Map<Id, ObjectNode | RelationNode>;
  onMemberClick: (member: Id) => void;
};

export function RelationNodeComponent(props: RelationComponentProps) {
  return (
    <div style="padding-left: 50px;">
      <p style="font-weight:bold;">{props.relation.description}</p>
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
                {props.nodeMap.get(member)?.description || member}
              </button>
            )}
          </For>
          {props.relation.members.length === 0 && (
            <span style={{ color: "grey" }}>None</span>
          )}
        </div>
      </div>
    </div>
  );
}

export type TraverseObjRelComponentProps = {
  nodes: (ObjectNode | RelationNode)[];
  visualizeGraph?: boolean;
};
export function TraverseObjRelComponent(props: TraverseObjRelComponentProps) {
  const [currentNodeId, setCurrentNodeId] = createSignal(props.nodes[0].id); // Root node's ID as initial state
  const nodeMap = new Map();

  // Separate and map the nodes
  props.nodes.forEach((node) => {
    nodeMap.set(node.id, node);
  });

  const objectNodes = props.nodes.filter(
    (node) => "children" in node
  ) as ObjectNode[];
  const relationNodes = props.nodes.filter(
    (node) => "members" in node
  ) as RelationNode[];

  const onNodeClick = (nodeId: Id) => {
    setCurrentNodeId(nodeId);
  };

  // Determine the type of the current node and render accordingly
  const renderCurrentNode = () => {
    const currentNode = nodeMap.get(currentNodeId());
    if ("members" in currentNode) {
      return (
        <RelationNodeComponent
          relation={currentNode}
          onMemberClick={onNodeClick}
          nodeMap={nodeMap}
        />
      );
    } else {
      return (
        <ObjectNodeComponent
          object={currentNode}
          onNodeClick={onNodeClick}
          nodeMap={nodeMap}
        />
      );
    }
  };

  return (
    <div>
      {props.visualizeGraph ? (
        <RelObjGraphVisualizer
          objectNodes={objectNodes}
          relationNodes={relationNodes}
        />
      ) : null}
      <Show when={nodeMap.has(currentNodeId())}>{renderCurrentNode()}</Show>
    </div>
  );
}
