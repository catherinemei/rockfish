import {
  For,
  createSignal,
  Show,
  createMemo,
  onMount,
  onCleanup,
} from "solid-js";
import * as d3 from "d3";
import dagre from "dagre";
import {
  RelationNodeWithSiblings,
  TraversalOutputProps,
  VisualizerProps,
  HypergraphWithSibling,
  HypergraphNodeWithSiblingsProps,
} from "./priority-traversal-types";
import {
  addSiblingsToHypergraph,
  findNodesOnSameLevel,
} from "./priority-traversal-flat-keyboard-utils";

/**
 * Component to output the traversal structure to the DOM
 * Contains both the visualization for the traversal structure (optional) and
 * also screen reader output for traversal structure
 */
export function TraversalOutputComponentKeyboardFlat(
  props: TraversalOutputProps
) {
  const [currentNodeId, setCurrentNodeId] = createSignal<string | null>(
    props.nodeGraph[0].id
  );

  const [hypergraphWithSiblings, setHypergraphWithSiblings] =
    createSignal<HypergraphWithSibling>(
      addSiblingsToHypergraph(props.nodeGraph)
    );

  // Keeps track of traversal history for undo
  const [history, setHistory] = createSignal<string[]>([]);

  const currentNode = createMemo(() => {
    if (currentNodeId() !== null) {
      return hypergraphWithSiblings()[currentNodeId() as string];
    }
    return hypergraphWithSiblings()[0]; // Default to the first node if none is selected
  });

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
          const parentSection = document.getElementById(
            `parents-${currentNodeId()}`
          );
          if (parentSection) {
            parentSection.focus();
          }
          arrowEvent.preventDefault();
        } else if (arrowEvent.key === "ArrowDown") {
          const firstChildId = currentNode().children[0];

          if (firstChildId) {
            setCurrentNodeId(firstChildId);
            const newSection = document.getElementById(
              `info-${firstChildId}-0`
            );
            if (newSection) {
              newSection.focus();
            }
          }

          // const childSection = document.getElementById(
          //   `children-${currentNodeId()}-0`
          // );
          // if (childSection) {
          //   childSection.focus();
          // }
          arrowEvent.preventDefault();
        }
      };

      window.addEventListener("keydown", handleArrowKey, { once: true });
    }

    if (event.key === "t") {
      const titleSection = document.getElementById(`info-${currentNodeId()}`);
      titleSection?.focus();
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

      const focusableGroupIds = [
        `info-${currentNodeId()}`,
        `parents-${currentNodeId()}`,
        `children-${currentNodeId()}`,
      ];

      const currentGroupId = focusableGroupIds.find((groupId) =>
        focusedElementId.startsWith(groupId)
      );

      if (currentGroupId) {
        const buttonsInGroup = Array.from(
          document.querySelectorAll(`#${currentGroupId} button`)
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
    } else if (event.key === "Enter") {
      const focusedElement = document.activeElement as HTMLElement;

      if (focusedElement && focusedElement.tagName === "BUTTON") {
        focusedElement.click();
        event.preventDefault();
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

      <Show when={props.showHypergraph}>
        <VisualizerComponent nodeGraph={hypergraphWithSiblings()} />
      </Show>
      <Show when={currentNodeId()}>
        <HypergraphNodeComponentKeyboardOnly
          node={currentNode() as RelationNodeWithSiblings}
          nodeGraph={hypergraphWithSiblings()}
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
  props: HypergraphNodeWithSiblingsProps
) {
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
    const adjacentNodeIds = findNodesOnSameLevel(
      props.node.id,
      props.nodeGraph
    );
    const adjacentNodes = Array.from(adjacentNodeIds)
      .map((nodeId) => props.nodeGraph[nodeId])
      .sort((a, b) => a.priority - b.priority);

    // Ensure the current node is the first in the list
    const currentNodeIndex = adjacentNodes.findIndex(
      (node) => node.id === props.node.id
    );

    if (currentNodeIndex > 0) {
      const [currentNode] = adjacentNodes.splice(currentNodeIndex, 1);
      adjacentNodes.unshift(currentNode);
    }

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
      <div
        id={`info-${props.node.id}`}
        aria-label={generateAriaLabel()}
        tabindex="0"
      >
        <For
          each={sortAdjacents()}
          fallback={
            <span
              style={{ color: "grey" }}
              aria-label={"There are no adjacent nodes"}
              id={`info-${props.node.id}-0`}
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
              id={`info-${props.node.id}-${idx()}`}
            >
              <span aria-hidden={true}>{adjacent.displayName}</span>
            </button>
          )}
        </For>
      </div>
      <div
        id={`parents-${props.node.id}`}
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
              id={`parent-${props.node.id}-0`}
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
              id={`parent-${props.node.id}-${idx()}`}
            >
              <span aria-hidden={true}>{parent.displayName}</span>
            </button>
          )}
        </For>
      </div>
      <div
        style={{ "margin-top": "10px" }}
        id={`children-${props.node.id}`}
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

/**
 * Component to visualize the traversal structure
 */

export function VisualizerComponent(props: VisualizerProps) {
  let svgRef: SVGSVGElement;

  onMount(() => {
    const width = 3000;
    const height = 300;
    const padding = 20;

    const svg = d3
      .select(svgRef)
      .attr("width", width + 2 * padding)
      .attr("height", height + 2 * padding)
      .append("g")
      .attr("transform", `translate(${padding},${padding})`);

    // Convert the hypergraph into a format suitable for Dagre
    const nodes = Object.values(props.nodeGraph);
    const links = [];

    for (const node of nodes) {
      for (const childId of node.children) {
        links.push({ source: node.id, target: childId });
      }
    }

    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}));

    nodes.forEach((node) => {
      g.setNode(node.id, { label: node.displayName, width: 100, height: 40 });
    });

    links.forEach((link) => {
      g.setEdge(link.source, link.target);
    });

    dagre.layout(g);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const link = svg
      .selectAll(".link")
      .data(g.edges())
      .enter()
      .append("line")
      .attr("class", "link")
      .attr("stroke-width", "2px")
      .attr("aria-hidden", "true")
      .attr("x1", (d: dagre.Edge) => g.node(d.v).x)
      .attr("y1", (d: dagre.Edge) => g.node(d.v).y)
      .attr("x2", (d: dagre.Edge) => g.node(d.w).x)
      .attr("y2", (d: dagre.Edge) => g.node(d.w).y)
      .attr("stroke", (d: dagre.Edge) => {
        const parent = g.node(d.v);
        return colorScale(parent.label);
      });

    const node = svg
      .selectAll(".node")
      .data(g.nodes())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("aria-hidden", "true")
      .attr(
        "transform",
        (d: string) => `translate(${g.node(d).x},${g.node(d).y})`
      );

    node
      .append("rect")
      .attr("width", 100)
      .attr("height", 40)
      .attr("x", -50)
      .attr("y", -20)
      .attr("aria-hidden", "true")
      .style("fill", "lightblue");

    node
      .append("text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .attr("aria-hidden", "true")
      .style("font-size", "12px")
      .text((d: string) => g.node(d).label);
  });

  return <svg aria-hidden ref={(el) => (svgRef = el)}></svg>;
}
