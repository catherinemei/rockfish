import { createEffect, createSignal, For } from "solid-js";
import { PriorityNode } from "./traversal-priority";
import dagre from "dagre";

type Id = string;
export type PriorityVisualizerComponentProps = {
  priorityNode: PriorityNode[];
};

export const PriorityGraphVisualizer = (
  props: PriorityVisualizerComponentProps
) => {
  const calculateLayout = () => {
    // Create a new directed graph
    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}));

    const augmentedEdges: any = [];
    const augmentedNodes: any = [];

    ////////////////////////////// CREATE PARENT-CHILD EDGES //////////////////////////////
    // Create visualization for parent-child edges
    props.priorityNode.forEach((node) => {
      g.setNode(node.id, { label: node.description, width: 80, height: 20 }); // Adjust width and height as needed

      const dagreNode = g.node(node.id);
      augmentedNodes.push({ ...dagreNode, id: node.id, type: "hierarchy" });

      node.relations.forEach((relId) => {
        if (relId.priority === "Contains (child)") {
          augmentedEdges.push({
            from: node.id,
            to: relId.id,
            type: "hierarchy",
          });
          g.setEdge(node.id, relId.id);
        }
      });
    });
    ///////////////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////// CREATE RELATION EDGES //////////////////////////////
    // Group all of relations with same priority together
    const relationMap: Map<string, string[]> = new Map();
    props.priorityNode.forEach((node) => {
      node.relations.forEach((rel) => {
        if (!relationMap.has(rel.priority)) {
          relationMap.set(rel.priority, []);
        }
        relationMap.get(rel.priority)?.push(rel.id);
      });
    });

    // Go through each type of relation and create relation edges
    // Skip hierarchy edges and parent edges [denoted "Contained by (parent)"]
    relationMap.forEach((relMembers, relPriority) => {
      if (
        relPriority === "Contains (child)" ||
        relPriority === "Contained by (parent)"
      ) {
        return;
      }
      g.setNode(relPriority, {
        label: relPriority,
        width: 80,
        height: 40,
      });
      relMembers.forEach((memberId) => {
        g.setEdge(relPriority, memberId);
        augmentedEdges.push({
          from: relPriority,
          to: memberId,
          type: "relation",
        });
      });

      const dagreNode = g.node(relPriority);
      augmentedNodes.push({
        ...dagreNode,
        id: relPriority,
        type: "relation",
      });
    });

    ///////////////////////////////////////////////////////////////////////////////////////////

    // Compute the layout (synchronous)
    dagre.layout(g);

    // Extract the nodes and edges from the graph
    const nodes = g.nodes().map((node) => ({ ...g.node(node), id: node }));

    const augmentedNodesWithPositions = g.nodes().map((node) => {
      const dagreNode = g.node(node);
      const nodeWithTypeInfo = augmentedNodes.find((n: any) => n.id === node);

      return { ...dagreNode, id: node, type: nodeWithTypeInfo.type };
    });

    // Calculate SVG dimensions
    const svgWidth = Math.max(...nodes.map((node) => node.x + node.width)) + 50;
    const svgHeight =
      Math.max(...nodes.map((node) => node.y + node.height)) + 50;

    return {
      nodes: augmentedNodesWithPositions,
      edges: augmentedEdges,
      svgWidth,
      svgHeight,
    };
  };

  const getEdgePath = (edge: any) => {
    const fromNode = layout().nodes.find((node: any) => node.id === edge.from);
    const toNode = layout().nodes.find((node: any) => node.id === edge.to);

    if (!fromNode || !toNode) return "";

    if (edge.type === "binary-relation") {
      const fromX = fromNode.x + 50;
      const fromY = fromNode.y;
      const toX = toNode.x + 20;
      const toY = toNode.y;
      // Adjust these values to change the curvature
      const ctrlPointX = (fromX + toX) / 2;
      const ctrlPointY = Math.min(fromY, toY) + 50;

      return `M ${fromX} ${fromY} Q ${ctrlPointX} ${ctrlPointY}, ${toX} ${toY}`;
    } else {
      const fromX = fromNode.x + 20;
      const fromY = fromNode.y + fromNode.height / 2;
      const toX = toNode.x + 20;
      const toY = toNode.y - toNode.height / 2;
      return `M ${fromX} ${fromY} L ${toX} ${toY}`;
    }
  };

  const [layout, setLayout] = createSignal(calculateLayout());

  createEffect(() => {
    if (window.bluefish) {
      setLayout(calculateLayout());
    }
  });

  return (
    <svg
      width={layout().svgWidth}
      height={layout().svgHeight}
      style={{ "padding-left": "10px" }}
    >
      <For each={layout().nodes}>
        {(node) => (
          <g
            transform={`translate(${node.x - node.width / 2}, ${
              node.y - node.height / 2
            })`}
          >
            {node.type === "hierarchy" ? (
              <rect width="120" height="20" fill="lightblue" />
            ) : (
              <ellipse
                cx="60"
                cy="20"
                rx="65"
                ry="20"
                fill="purple"
                opacity={0.5}
              />
            )}
            <text
              x="60"
              y={node.type === "hierarchy" ? 10 : 20}
              font-size={node.type === "hierarchy" ? "15px" : "11px"}
              text-anchor="middle"
              dominant-baseline="central"
            >
              {node.label}
            </text>
          </g>
        )}
      </For>
      <For each={layout().edges}>
        {(edge) => (
          <path
            d={getEdgePath(edge)}
            stroke={edge.type === "hierarchy" ? "green" : "purple"}
            fill="none"
            marker-end={
              edge.type === "relation"
                ? "url(#arrowhead-purple)"
                : edge.type === "hierarchy"
                ? "url(#arrowhead-green)"
                : "none"
            }
            marker-start="none"
          />
        )}
      </For>
      <defs>
        {/* Black arrowhead for object edges */}
        <marker
          id="arrowhead-green"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="green" />
        </marker>
        {/* Purple arrowhead for relation edges */}
        <marker
          id="arrowhead-purple"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="purple" />
        </marker>
      </defs>
    </svg>
  );
};
