import {
  For,
  createSignal,
  Show,
  createMemo,
  onMount,
  onCleanup,
} from "solid-js";
import {
  TraversalOutputProps,
  HypergraphNodeProps,
} from "./priority-traversal-types";

/**
 * Component to output the traversal structure to the DOM
 * Contains both the visualization for the traversal structure (optional) and
 * also screen reader output for traversal structure
 */
export function TraversalOutputComponentKeyboardParentFocus(
  props: TraversalOutputProps
) {
  const [currentNodeId, setCurrentNodeId] = createSignal<string | null>(
    props.nodeGraph[0].id
  );

  // Keeps track of traversal history for undo
  const [history, setHistory] = createSignal<string[]>([]);

  const currentNode = createMemo(() => {
    if (currentNodeId() !== null) {
      return props.nodeGraph[currentNodeId() as string];
    }
    return props.nodeGraph[0]; // Default to the first node if none is selected
  });

  const calculateParentIndex = () => {
    const parents = currentNode().parents;
    const previousNodeId = history()[history().length - 1];
    return parents.indexOf(previousNodeId);
  };

  const handleNodeClick = (oldId: string, newId: string) => {
    setHistory((prev) => [...prev, oldId]);
    setCurrentNodeId(newId);

    // Moves screen reader focus
    setTimeout(() => {
      const newNode = document.getElementById(`info-${newId}`);

      if (newNode) {
        if (!newNode.hasAttribute("tabindex")) {
          newNode.setAttribute("tabindex", "0");
        }
        newNode.focus();
      }
    }, 0);
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Shift") {
      const handleArrowKey = (arrowEvent: KeyboardEvent) => {
        if (arrowEvent.key === "ArrowUp") {
          console.log("arrow up, moving to parent layer");
          // Navigate up through the parent focus using history
          const historyList = history();
          console.log("history list", historyList);
          if (historyList.length > 0) {
            console.log("found non-empty history list");
            const previousNodeId = historyList.pop();
            console.log("previous node id", previousNodeId);
            if (previousNodeId) {
              setHistory([...historyList]); // Update history without the last node
              setCurrentNodeId(previousNodeId);

              console.log("setting focus to previous node");
              console.log("new history:,", history());

              const previousNodeElement = document.getElementById(
                `info-${previousNodeId}`
              );

              if (previousNodeElement) {
                console.log("found new node and focusing");
                previousNodeElement.focus();
              }
            }
          }
          arrowEvent.preventDefault();
        } else if (arrowEvent.key === "ArrowDown") {
          console.log("arrow down, moving to children layer");
          // Directly navigate to first child if children exist
          // If not, then select entire group and announce that no children exist

          const firstChildId = currentNode().children[0];

          console.log("current node is:", currentNode());
          console.log("found children", firstChildId);

          if (firstChildId) {
            // update history list with traversed children node
            setHistory((prev) => [...prev, currentNode().id]);

            console.log("set history to: ", history());

            setCurrentNodeId(firstChildId);

            console.log("new current node:", currentNode());
            const newSection = document.getElementById(`info-${firstChildId}`);
            if (newSection) {
              newSection.focus();
            }
          } else {
            const childSection = document.getElementById(`children-group`);
            if (childSection) {
              childSection.focus();
            }
          }
          arrowEvent.preventDefault();
        }
      };

      window.addEventListener("keydown", handleArrowKey, { once: true });
    }

    if (event.key === "t") {
      const titleSection = document.getElementById(`home`);
      titleSection?.focus();
    } else if (event.key === "s") {
      const parents = currentNode().parents;
      if (parents.length > 0) {
        // Get the current parent index from history, and cycle to the next parent
        let parentIndex = calculateParentIndex();
        let nextIndex = (parentIndex + 1) % parents.length;

        const nextParentId = parents[nextIndex];
        setHistory((prev) => [...prev, currentNodeId() as string]);
        setCurrentNodeId(nextParentId);

        const parentSection = document.getElementById(`info-${nextParentId}`);
        if (parentSection) {
          parentSection.focus();
        }
      }
      event.preventDefault();
    } else if (event.key === "Backspace") {
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
            const newNode = document.getElementById(`info-${previousNodeId}`);
            if (newNode) {
              newNode.focus();
            }
          }, 700);
        }
        return newHistory;
      });
    } else if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight" ||
      event.key === "ArrowUp" ||
      event.key === "ArrowDown"
    ) {
      const focusedElement = document.activeElement as HTMLElement;
      const focusedElementId = focusedElement?.id;
      const focusableGroupIds = ["parents", "children"];

      const currentGroupId = focusableGroupIds.find((groupId) =>
        focusedElementId.startsWith(groupId)
      );

      if (focusedElementId.startsWith("info-") || focusedElementId === "home") {
        const buttonsInGroup = Array.from(
          document.querySelectorAll(`#home button`)
        ) as HTMLElement[];

        const currentIndex = buttonsInGroup.indexOf(focusedElement);
        let newIndex = currentIndex;

        if (
          (event.key === "ArrowLeft" || event.key === "ArrowUp") &&
          currentIndex > 0
        ) {
          newIndex = currentIndex - 1;
        } else if (
          (event.key === "ArrowRight" || event.key === "ArrowDown") &&
          currentIndex < buttonsInGroup.length - 1
        ) {
          newIndex = currentIndex + 1;
        }

        const newNodeId = buttonsInGroup[newIndex]?.id.split("info-")[1];
        if (newNodeId) {
          setCurrentNodeId(newNodeId);
        }
        buttonsInGroup[newIndex]?.focus();
        event.preventDefault();
      } else if (currentGroupId) {
        const buttonsInGroup = Array.from(
          document.querySelectorAll(`#${currentGroupId}-group button`)
        ) as HTMLElement[];
        const currentIndex = buttonsInGroup.indexOf(focusedElement);
        if (
          (event.key === "ArrowLeft" || event.key === "ArrowUp") &&
          currentIndex > 0
        ) {
          buttonsInGroup[currentIndex - 1].focus();
          event.preventDefault();
        } else if (
          (event.key === "ArrowRight" || event.key === "ArrowDown") &&
          currentIndex < buttonsInGroup.length - 1
        ) {
          buttonsInGroup[currentIndex + 1].focus();
          event.preventDefault();
        } else {
          event.preventDefault();
        }
      }
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyPress);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyPress);
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
        <HypergraphNodeComponentKeyboardOnly
          history={history()}
          node={currentNode()}
          nodeGraph={props.nodeGraph}
          onNodeClick={handleNodeClick}
        />
      </Show>
    </div>
  );
}

/**
 * Component to output a single node in the hypergraph
 * Screen reader output for single node in traversal structure
 */
export function HypergraphNodeComponentKeyboardOnly(
  props: HypergraphNodeProps
) {
  // based on the parent node in focus, siblings are the child nodes of that parent
  // history can be found as props.history
  function findSiblings(currentId: string) {
    const parent = props.history
      ? props.history[props.history.length - 1]
      : props.nodeGraph[currentId].parents[0];

    const siblings = parent ? props.nodeGraph[parent].children : [currentId];
    return siblings;
  }

  const sortedParents = createMemo(() =>
    props.node.parents
      .map((parentId) => props.nodeGraph[parentId])
      .sort((a, b) => a.priority - b.priority)
  );

  const collectParentNames = createMemo(() => {
    return sortedParents()
      .map((parentNode) => parentNode.descriptionTokens?.label)
      .join(", ");
  });

  const sortedChildren = createMemo(() =>
    props.node.children
      .map((childId) => props.nodeGraph[childId])
      .sort((a, b) => a.priority - b.priority)
  );

  const collectChildrenNames = createMemo(() => {
    return sortedChildren()
      .map((childNode) => childNode.descriptionTokens?.label)
      .join(", ");
  });

  const sortAdjacents = createMemo(() => {
    const adjacentNodeIds = findSiblings(props.node.id);

    const adjacentNodes = Array.from(adjacentNodeIds)
      .map((nodeId) => props.nodeGraph[nodeId])
      .sort((a, b) => {
        // First, sort by priority (high to low)
        const priorityDifference = a.priority - b.priority;
        if (priorityDifference !== 0) {
          return priorityDifference;
        }
        // If priorities are the same, sort by ID (lexicographical order)
        return a.id.localeCompare(b.id);
      });
    return adjacentNodes;
  });

  const generateAriaLabel = createMemo(() => {
    // collect name of all children nodes
    const allChildren = sortedChildren();
    const childrenNames = allChildren
      .map((childNode) => childNode.descriptionTokens?.label)
      .join(", ");

    const nodeDescription =
      childrenNames.length > 0 ? "contains " + childrenNames : "";
    return `${props.node.displayName} node with ${props.node.parents.length} parent and ${props.node.children.length} children nodes; ${nodeDescription}`;
  });

  return (
    <div style={{ padding: "20px" }}>
      <div id={`home`} aria-label={generateAriaLabel()} tabindex="0">
        <For
          each={sortAdjacents()}
          fallback={
            <span
              style={{ color: "grey" }}
              aria-label={"There are no adjacent nodes"}
              id={`info-none`}
            >
              {" "}
              None
            </span>
          }
        >
          {(adjacent, idx) => (
            <button
              onClick={() => props.onNodeClick(props.node.id, adjacent.id)}
              style={{ "margin-right": "5px" }}
              aria-label={`Node ${idx() + 1} of ${sortAdjacents().length}; ${
                adjacent.displayName
              }`}
              id={`info-${adjacent.id}`}
            >
              <span aria-hidden={true}>{adjacent.displayName}</span>
            </button>
          )}
        </For>
      </div>
      <div
        id={`parents-group`}
        style={{ "margin-top": "10px" }}
        aria-label={`${
          props.node.parents.length
        } parent relations; ${collectParentNames()}`}
        tabindex="0"
      >
        <span style={{ "font-weight": "bold" }} aria-hidden={true}>
          Parents{" "}
        </span>
        <For
          each={sortedParents()}
          fallback={
            <span
              style={{ color: "grey" }}
              aria-label="There are no parent nodes"
              id={`parents-${props.node.id}-0`}
            >
              {" "}
              None
            </span>
          }
        >
          {(parent, idx) => (
            <button
              onClick={() => props.onNodeClick(props.node.id, parent.id)}
              style={{ "margin-right": "5px" }}
              aria-label={`Parent ${idx() + 1} of ${sortedParents().length}; ${
                parent.displayName
              }`}
              id={`parents-${props.node.id}-${idx()}`}
            >
              <span aria-hidden={true}>{parent.displayName}</span>
            </button>
          )}
        </For>
      </div>
      <div
        style={{ "margin-top": "10px" }}
        id={`children-group`}
        aria-label={`${
          props.node.children.length
        } child relations; ${collectChildrenNames()}`}
        tabindex="0"
      >
        <span style={{ "font-weight": "bold" }} aria-hidden={true}>
          Children{" "}
        </span>
        <For
          each={sortedChildren()}
          fallback={
            <span
              style={{ color: "grey" }}
              aria-label="There are no children nodes"
              id={`children-${props.node.id}-0`}
            >
              {" "}
              None
            </span>
          }
        >
          {(child, idx) => (
            <button
              onClick={() => props.onNodeClick(props.node.id, child.id)}
              style={{ "margin-right": "5px" }}
              aria-label={`Child ${idx() + 1} of ${sortedChildren().length}; ${
                child.displayName
              }`}
              id={`children-${props.node.id}-${idx()}`}
            >
              <span aria-hidden={true}>{child.displayName}</span>
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
