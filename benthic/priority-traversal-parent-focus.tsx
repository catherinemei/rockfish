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
  const [history, setHistory] = createSignal<string[]>(["0"]);

  // This will store the default paths from the root node to each node
  const [defaultPaths, setDefaultPaths] = createSignal<Map<string, string[]>>(
    new Map()
  );

  const currentNode = createMemo(() => {
    if (currentNodeId() !== null) {
      return props.nodeGraph[currentNodeId()!];
    }
    return props.nodeGraph[0]; // Default to the first node if none is selected
  });

  const calculateParentIndex = () => {
    const parents = props.nodeGraph[currentNodeId()!].parents;
    const previousNodeId = history()[history().length - 2];
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
    if (event.key === "u") {
      // Navigate up through the parent focus using history
      const historyList = history();
      if (historyList.length > 2) {
        const curNodeId = historyList.pop();
        const parentNodeId = historyList[historyList.length - 1];
        const grandParentNodeId = historyList[historyList.length - 2];

        // Check if grandparent node is a valid parent of parent node
        if (
          grandParentNodeId &&
          props.nodeGraph[parentNodeId!].parents.includes(grandParentNodeId)
        ) {
          setHistory([...historyList]);
          setCurrentNodeId(parentNodeId);
        } else {
          // update history to be default path up to parent node
          const defaultPath = defaultPaths().get(parentNodeId!);
          setHistory([...(defaultPath ?? ["0"])]);
          setCurrentNodeId(parentNodeId);
        }

        const parentNodeElement = document.getElementById(
          `info-${parentNodeId}`
        );

        if (parentNodeElement) {
          parentNodeElement.focus();
        }
      } else if (historyList.length > 1) {
        const curNodeId = historyList.pop();
        const previousNodeId = historyList[historyList.length - 1];
        if (previousNodeId) {
          setHistory([...historyList]); // Update history without the last node
          setCurrentNodeId(previousNodeId);

          const previousNodeElement = document.getElementById(
            `info-${previousNodeId}`
          );
          if (previousNodeElement) {
            previousNodeElement.focus();
          }
        }
      } else {
        const parentSection = document.getElementById(`parents-group`);
        parentSection?.focus();
      }
      event.preventDefault();
    } else if (event.key === "d") {
      // Directly navigate to first child if children exist
      // If not, then select entire group and announce that no children exist

      const firstChildId = props.nodeGraph[currentNodeId()!].children[0];

      if (firstChildId) {
        // update history list with traversed children node
        setHistory((prev) => [...prev, firstChildId]);

        setCurrentNodeId(firstChildId);

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
      event.preventDefault();
    } else if (event.key === "t") {
      const titleSection = document.getElementById(`home`);
      titleSection?.focus();
    } else if (event.key === "s") {
      const parents = props.nodeGraph[currentNodeId()!].parents;
      if (parents.length > 0) {
        // Get the current parent index from history, and cycle to the next parent
        let parentIndex = calculateParentIndex();
        let nextIndex = (parentIndex + 1) % parents.length;

        const nextParentId = parents[nextIndex];
        let curHistory = history();
        const curNodeId = curHistory.pop();
        const oldParent = curHistory.pop();
        setHistory((prev) => [...curHistory, nextParentId, currentNodeId()!]);

        const switchingFocus = document.getElementById("switch-focus");
        if (switchingFocus) {
          switchingFocus.focus();
        }

        setTimeout(() => {
          const curNodeSection = document.getElementById(`info-${curNodeId}`);

          if (curNodeSection) {
            curNodeSection.focus();
          }
        }, 700);
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
          const historyList = history();
          const previousAdjNode = historyList.pop();
          setHistory([...historyList, newNodeId]);
          setCurrentNodeId(newNodeId);
        }
        buttonsInGroup[newIndex]?.focus();

        event.preventDefault();
      } else {
        event.preventDefault();
      }
    }
  };

  onMount(() => {
    const paths = calculateDefaultPaths(props.nodeGraph);
    setDefaultPaths(paths);

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
      <button
        id="switch-focus"
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
        Switching Parent
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
    if (!props.history || props.history.length < 2) {
      return [currentId];
    } else {
      const parentFocus = props.history[props.history.length - 2];
      const siblings = props.nodeGraph[parentFocus].children;
      return siblings;
    }
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

/**
 * Function to calculate the shortest path from root (node "0") to all other nodes.
 * This function uses BFS to explore the graph and generates a map of default paths.
 */
function calculateDefaultPaths(
  nodeGraph: Record<string, any>,
  rootId: string = "0"
) {
  const defaultPaths = new Map<string, string[]>();
  const queue: [string, string[]][] = [[rootId, [rootId]]]; // Tuple of [currentNode, path to currentNode]

  while (queue.length > 0) {
    const [currentNodeId, pathToCurrent] = queue.shift()!;

    // If this node is already visited, skip it
    if (defaultPaths.has(currentNodeId)) continue;

    // Store the path to the current node
    defaultPaths.set(currentNodeId, pathToCurrent);

    // Explore the children of the current node and continue BFS
    const children = nodeGraph[currentNodeId].children;
    for (const childId of children) {
      if (!defaultPaths.has(childId)) {
        queue.push([childId, [...pathToCurrent, childId]]);
      }
    }
  }

  return defaultPaths;
}
