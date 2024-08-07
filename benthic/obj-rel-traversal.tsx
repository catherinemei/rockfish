import { For, createSignal, Show } from "solid-js";
import {
  Id,
  ObjectNode,
  RelationNode,
  ObjectComponentProps,
  RelationComponentProps,
  TraverseObjRelComponentProps,
} from "./obj-rel-traversal-types";

export function ObjectNodeComponent(props: ObjectComponentProps) {
  const objectNode = props.nodeMap[props.objectId] as ObjectNode;
  const renderRelationButton = (relationId: Id) => {
    const relationNode = props.nodeMap[relationId] as RelationNode;

    // Inline binary relation with only 2 members
    if (relationNode.members.length === 2) {
      // Find the other member in the relation
      const relatedMemberId: Id =
        relationNode.members.find((member) => member !== props.objectId) || "";
      return (
        <button
          onClick={() => props.onNodeClick(relatedMemberId)}
          style={{ "margin-right": "5px" }}
        >
          {relationNode.displayName} connects to{" "}
          {props.nodeMap[relatedMemberId].displayName}
        </button>
      );
    } else {
      // Render a button for the relation itself
      return (
        <button
          onClick={() => props.onNodeClick(relationId)}
          style={{ "margin-right": "5px" }}
        >
          {relationNode.displayName}
        </button>
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div id={props.objectId} aria-label={"test aria label"}>
        <h2 aria-hidden={true}>{objectNode.displayName}</h2>
        <p aria-hidden={true}>{objectNode.description}</p>
      </div>

      {/* Parent */}
      <div style={{ "margin-top": "10px" }}>
        <Show
          when={props.nodeMap[objectNode.parentId]}
          fallback={
            <>
              <span aria-hidden={true} style={{ "font-weight": "bold" }}>
                Parent:{" "}
              </span>
              <span aria-hidden={true} style={{ color: "grey" }}>
                {" "}
                None
              </span>
            </>
          }
        >
          <span aria-hidden={true} style={{ "font-weight": "bold" }}>
            Parent:{" "}
          </span>
          <button
            onClick={() => props.onNodeClick(objectNode.parentId)}
            style={{ "margin-right": "5px" }}
          >
            {props.nodeMap[objectNode.parentId].displayName}
          </button>
        </Show>
      </div>

      {/* Children */}
      <div style={{ "margin-top": "10px" }}>
        <span style={{ "font-weight": "bold" }}>Children: </span>
        <For
          each={objectNode.children}
          fallback={
            <span style={{ color: "grey" }} aria-hidden={true}>
              {" "}
              None
            </span>
          }
        >
          {(childId) => (
            <button
              onClick={() => props.onNodeClick(childId)}
              style={{ "margin-right": "5px", "margin-bottom": "5px" }}
            >
              {props.nodeMap[childId].displayName}
            </button>
          )}
        </For>
      </div>

      {/* Relations */}
      <div style={{ "margin-top": "10px" }}>
        <span style={{ "font-weight": "bold" }}>Relations: </span>
        <For
          each={objectNode.relations}
          fallback={
            <span style={{ color: "grey" }} aria-hidden={true}>
              {" "}
              None
            </span>
          }
        >
          {(relationId) => renderRelationButton(relationId)}
        </For>
      </div>
    </div>
  );
}

export function RelationNodeComponent(props: RelationComponentProps) {
  const relationNode = props.nodeMap[props.relationId] as RelationNode;
  return (
    <div style={{ padding: "20px" }}>
      <h2>{relationNode.displayName}</h2>
      <p>{relationNode.description}</p>
      <div style={{ "margin-top": "10px" }}>
        <span style={{ "font-weight": "bold" }}>Members: </span>

        <For
          each={relationNode.members}
          fallback={
            <span style={{ color: "grey" }} aria-hidden={true}>
              {" "}
              None
            </span>
          }
        >
          {(memberId) => (
            <button
              onClick={() => props.onMemberClick(memberId)}
              style={{ "margin-right": "5px" }}
            >
              {props.nodeMap[memberId].displayName}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}

export function TraverseObjRelComponent(props: TraverseObjRelComponentProps) {
  const [currentNodeId, setCurrentNodeId] = createSignal<string>(
    props.nodeGraph[0].id
  );

  const onNodeClick = (nodeId: Id) => {
    setCurrentNodeId(nodeId);
  };

  // Determine the type of the current node and render accordingly
  const renderCurrentNode = () => {
    const curNode = props.nodeGraph[currentNodeId()];

    if (curNode.nodeType == "relation") {
      return (
        <RelationNodeComponent
          relationId={currentNodeId()}
          onMemberClick={onNodeClick}
          nodeMap={props.nodeGraph}
        />
      );
    } else if (curNode.nodeType == "object") {
      return (
        <ObjectNodeComponent
          objectId={currentNodeId()}
          onNodeClick={onNodeClick}
          nodeMap={props.nodeGraph}
        />
      );
    }
  };

  return (
    <div>
      {/* {props.visualizeGraph ? (
        <RelObjGraphVisualizer
          objectNodes={objectNodes}
          relationNodes={relationNodes}
        />
      ) : null} */}
      <Show when={currentNodeId()}>{renderCurrentNode()}</Show>
    </div>
  );
}
