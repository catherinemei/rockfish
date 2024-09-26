import {
  For,
  createSignal,
  Show,
  onMount,
  onCleanup,
  createMemo,
} from "solid-js";
import {
  Id,
  ObjectNode,
  RelationNode,
  ObjectRelationNodeComponentProps,
  TraverseObjRelComponentProps,
} from "./obj-rel-traversal-types";

export function ObjectRelationNodeComponent(
  props: ObjectRelationNodeComponentProps
) {
  const renderRelationButtonForObjectNode = (relationId: Id) => {
    const relationNode = props.nodeMap[relationId] as RelationNode;

    // Inline binary relation with only 2 members
    if (relationNode.members.length === 2) {
      // Find the other member in the relation
      const relatedMemberId: Id =
        relationNode.members.find((member) => member !== props.node.id) || "";
      return (
        <button
          onClick={() => props.onButtonClick(props.node.id, relatedMemberId)}
          style={{ "margin-right": "5px" }}
          aria-label={`${relationNode.displayName} connects to ${props.nodeMap[relatedMemberId].displayName}`}
        >
          <span aria-hidden={true}>
            {relationNode.displayName} connects to{" "}
            {props.nodeMap[relatedMemberId].displayName}
          </span>
        </button>
      );
    } else {
      // Render a button for the relation itself
      return (
        <button
          onClick={() => props.onButtonClick(props.node.id, relationId)}
          style={{ "margin-right": "5px" }}
          aria-label={`${relationNode.displayName}; ${relationNode.description}`}
        >
          <span aria-hidden={true}>{relationNode.displayName}</span>
        </button>
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        id={props.node.id}
        aria-label={`${props.node.displayName} ${props.node.nodeType} node`}
      >
        <h2 aria-hidden={true}>{props.node.displayName}</h2>
        <p aria-hidden={true}>{props.node.description}</p>
      </div>

      {/* Parent */}

      <Show when={props.node.nodeType === "object"}>
        <div aria-label={"Parent"} tabindex="0">
          <Show
            when={props.nodeMap[props.node.parentId]}
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
              onClick={() =>
                props.onButtonClick(props.node.id, props.node.parentId)
              }
              style={{ "margin-right": "5px" }}
              aria-label={`${props.nodeMap[props.node.parentId].displayName}; ${
                props.nodeMap[props.node.parentId].description
              }`}
            >
              <span aria-hidden={true}>
                {props.nodeMap[props.node.parentId].displayName}
              </span>
            </button>
          </Show>
        </div>

        {/* Children */}
        <div
          style={{ "margin-top": "10px" }}
          aria-label={`${props.node.children.length} children`}
          tabindex="0"
        >
          <span aria-hidden={true} style={{ "font-weight": "bold" }}>
            Children:{" "}
          </span>
          <For
            each={props.node.children}
            fallback={
              <span style={{ color: "grey" }} aria-hidden={true}>
                {" "}
                None
              </span>
            }
          >
            {(childId) => (
              <button
                onClick={() => props.onButtonClick(props.node.id, childId)}
                style={{ "margin-right": "5px", "margin-bottom": "5px" }}
                aria-label={`${props.nodeMap[childId].displayName}; ${props.nodeMap[childId].description}`}
              >
                <span aria-hidden={true}>
                  {props.nodeMap[childId].displayName}
                </span>
              </button>
            )}
          </For>
        </div>

        {/* Relations */}
        <div
          style={{ "margin-top": "10px" }}
          aria-label={`${props.node.relations.length} relations`}
          tabindex="0"
        >
          <span aria-hidden={true} style={{ "font-weight": "bold" }}>
            Relations:{" "}
          </span>
          <For
            each={props.node.relations}
            fallback={
              <span style={{ color: "grey" }} aria-hidden={true}>
                {" "}
                None
              </span>
            }
          >
            {(relationId) => renderRelationButtonForObjectNode(relationId)}
          </For>
        </div>
      </Show>
      <Show when={props.node.nodeType === "relation"}>
        <div aria-label={`${props.node.members.length} members`}>
          <span aria-hidden={true} style={{ "font-weight": "bold" }}>
            Members:{" "}
          </span>

          <For
            each={props.node.members}
            fallback={
              <span style={{ color: "grey" }} aria-hidden={true}>
                {" "}
                None
              </span>
            }
          >
            {(memberId) => (
              <button
                onClick={() => props.onButtonClick(props.node.id, memberId)}
                style={{ "margin-right": "5px" }}
                aria-label={`${props.nodeMap[memberId].displayName}`}
              >
                <span aria-hidden={true}>
                  {props.nodeMap[memberId].displayName}
                </span>
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}

export function TraverseObjRelComponent(props: TraverseObjRelComponentProps) {
  const [currentNodeId, setCurrentNodeId] = createSignal<string>(
    props.nodeGraph[0].id
  );

  // Keeps track of traversal history for undo
  const [history, setHistory] = createSignal<string[]>([]);

  const handleNodeClick = (oldId: string, newId: string) => {
    setHistory((prev) => [...prev, oldId]);
    setCurrentNodeId(newId);

    // Moves screen reader focus
    setTimeout(() => {
      const newNode = document.getElementById(newId);

      if (newNode) {
        if (!newNode.hasAttribute("tabindex")) {
          newNode.setAttribute("tabindex", "0");
        }
        newNode.focus();
      }
    }, 0);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Backspace") {
      setHistory((prev) => {
        const newHistory = [...prev];
        const previousNodeId = newHistory.pop();

        if (previousNodeId) {
          // used to announce undo action
          const undoMessage = document.getElementById("hidden-focus");
          if (undoMessage) {
            undoMessage.focus();
          }

          setCurrentNodeId(previousNodeId);

          // reset focus to previous node after announcement
          setTimeout(() => {
            const newNode = document.getElementById(previousNodeId);
            if (newNode) {
              newNode.focus();
            }
          }, 700);
        }
        return newHistory;
      });
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyPress);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyPress);
  });

  const currentNode = createMemo(() => {
    if (currentNodeId() !== null) {
      return props.nodeGraph[currentNodeId() as string];
    }
    return props.nodeGraph[0]; // Default to the first node if none is selected
  });

  return (
    <div>
      <button
        id="hidden-focus"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          margin: "-1px",
          padding: "0",
          border: "0",
          clip: "rect(0, 0, 0, 0)",
          overflow: "hidden",
          "white-space": "nowrap",
        }}
        aria-hidden="true"
      >
        Pressing Undo
      </button>
      <Show when={currentNodeId()}>
        <ObjectRelationNodeComponent
          node={currentNode()}
          nodeMap={props.nodeGraph}
          onButtonClick={handleNodeClick}
        />
      </Show>
    </div>
  );
}
