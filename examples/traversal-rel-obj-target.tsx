import { createSignal, For } from "solid-js";
import { RelationNode, ObjectNode } from "./traversal-rel-obj";
import dagre from "dagre";

type Id = string;
export type RelObjVisualizerComponentProps = {
  objectNodes: ObjectNode[];
  relationNodes: RelationNode[];
};

export const RelObjGraphVisualizer = (
  props: RelObjVisualizerComponentProps
) => {
  const calculateLayout = () => {
    // Create a new directed graph
    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}));

    const augmentedEdges: any = [];

    // Set nodes for ObjectNodes
    props.objectNodes.forEach((node) => {
      g.setNode(node.id, { label: node.description, width: 80, height: 20 }); // Adjust width and height as needed
      node.children.forEach((childId) => {
        g.setEdge(node.id, childId);
        augmentedEdges.push({ from: node.id, to: childId, type: "object" });
      });
    });

    // Set nodes for RelationNodes
    props.relationNodes.forEach((node) => {
      if (node.members.length === 2) {
        // Direct edge between the two members for binary relation
        const [from, to] = node.members;
        augmentedEdges.push({ from, to, type: "binary-relation" });
      } else {
        // Regular relation node and edges
        g.setNode(node.id, { label: node.description, width: 80, height: 40 });
        node.members.forEach((memberId) => {
          g.setEdge(node.id, memberId);
          augmentedEdges.push({
            from: node.id,
            to: memberId,
            type: "relation",
          });
        });
      }
    });

    // Compute the layout (synchronous)
    dagre.layout(g);

    const augmentedNodes = g.nodes().map((node) => {
      const dagreNode = g.node(node);
      const originalNode =
        props.objectNodes.find((n) => n.id === node) ||
        props.relationNodes.find((n) => n.id === node);

      // Determine the type of the node
      let type = "object";
      if (originalNode && "members" in originalNode) {
        type = "relation";
      }

      return { ...dagreNode, id: node, type: type };
    });

    // Extract the nodes and edges from the graph
    const nodes = g.nodes().map((node) => ({ ...g.node(node), id: node }));

    // Calculate SVG dimensions
    const svgWidth = Math.max(...nodes.map((node) => node.x + node.width)) + 50;
    const svgHeight =
      Math.max(...nodes.map((node) => node.y + node.height)) + 50;

    return {
      nodes: augmentedNodes,
      edges: augmentedEdges,
      svgWidth,
      svgHeight,
    };
  };

  const getEdgePath = (edge: any) => {
    const fromNode = layout().nodes.find((node) => node.id === edge.from);
    const toNode = layout().nodes.find((node) => node.id === edge.to);

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
            {node.type === "object" ? (
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
              y={node.type === "object" ? 10 : 20}
              font-size={node.type === "object" ? "15px" : "11px"}
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
            stroke={edge.type === "object" ? "green" : "purple"}
            fill="none"
            marker-end={
              edge.type === "relation"
                ? "url(#arrowhead-purple)"
                : edge.type === "object"
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
