import { createSignal, For } from "solid-js";
import { RelationNode, ObjectNode } from "./traversal-rel-obj";
type Id = string;
export type RelObjVisualizerComponentProps = {
  objectNodes: ObjectNode[];
  relationNodes: RelationNode[];
};

export const RelObjGraphVisualizer = (
  props: RelObjVisualizerComponentProps
) => {
  const calculateLayout = () => {
    const levels = new Map();
    let maxLevel = 0;
    const nodePositions = new Map();
    const edges: any = [];

    // Assign levels to ObjectNodes, starting from level 2
    const assignLevel = (nodeId: Id, level: number) => {
      if (levels.has(nodeId)) return;
      levels.set(nodeId, level);
      maxLevel = Math.max(maxLevel, level);

      const children =
        props.objectNodes.find((n) => n.id === nodeId)?.children || [];
      children.forEach((childId) => assignLevel(childId, level + 1));
    };

    // Start from root ObjectNodes
    assignLevel("root", 0); // Assign level 1 to root node
    props.objectNodes
      .filter((node) => !node.parent || node.parent === "root")
      .forEach((nonRootNode) => {
        assignLevel(nonRootNode.id, 1); // Start from level 2 for ObjectNodes that are not root
      });

    // Calculate positions for ObjectNodes
    const levelWidths = new Array(maxLevel + 1).fill(0);

    levels.forEach((level, nodeId) => {
      const position = levelWidths[level]++;
      const node = props.objectNodes.find((n) => n.id === nodeId);
      nodePositions.set(nodeId, {
        x: position * 90 + 50,
        y: level * 100,
        description: node?.description,
        type: "object",
      });
    });

    // Adjust root to be central
    const maxWidth = Math.max(...levelWidths);
    const oldRootObject = nodePositions.get("root");
    nodePositions.set("root", {
      x: (maxWidth * 90) / 2,
      y: oldRootObject.y,
      description: oldRootObject.description,
      type: oldRootObject.type,
    });

    // Calculate paths for ObjectNode edges
    props.objectNodes.forEach((node) => {
      const fromPos = nodePositions.get(node.id);
      node.children.forEach((childId) => {
        const toPos = nodePositions.get(childId);
        if (fromPos && toPos) {
          const path = `M ${fromPos.x + 45} ${fromPos.y + 20} L ${
            toPos.x + 45
          } ${toPos.y - 5}`;
          edges.push({ path, type: "object" });
        }
      });
    });

    // Calculate positions for RelationNodes
    props.relationNodes.forEach((node, index) => {
      const x = index * 110;
      const y = (maxLevel + 1) * 100;
      nodePositions.set(node.id, {
        x,
        y,
        description: node.description,
        type: "relation",
      });

      // Calculate paths for RelationNode edges
      node.members.forEach((memberId) => {
        const memberNode = nodePositions.get(memberId);
        if (memberNode) {
          const path = `M ${x + 90} ${y} L ${memberNode.x + 45} ${
            memberNode.y + 25
          }`;
          edges.push({ path, type: "relation" });
        }
      });
    });

    // Calculate SVG dimensions
    const svgWidth =
      Math.max(...Array.from(nodePositions.values(), (pos) => pos.x)) + 250;
    const svgHeight =
      Math.max(...Array.from(nodePositions.values(), (pos) => pos.y)) + 100;
    console.log(nodePositions);
    console.log(props.objectNodes);
    console.log(props.relationNodes);

    return {
      nodes: Array.from(nodePositions.values()),
      edges,
      svgWidth,
      svgHeight,
    };
  };

  const [layout, setLayout] = createSignal(calculateLayout());

  return (
    <svg width={layout().svgWidth} height={layout().svgHeight}>
      <For each={layout().nodes}>
        {(node) => (
          <g transform={`translate(${node.x}, ${node.y})`}>
            {node.type === "object" ? (
              <rect width="80" height="20" fill="lightblue" />
            ) : (
              <ellipse
                cx="80"
                cy="0"
                rx="55"
                ry="20"
                fill="purple"
                opacity={0.5}
              />
            )}
            <text
              x={node.type === "object" ? 40 : 80}
              y={node.type === "object" ? 15 : 5}
              font-size={node.type === "object" ? "15px" : "12px"}
              text-anchor="middle"
            >
              {node.description}
            </text>
          </g>
        )}
      </For>
      <For each={layout().edges}>
        {(edge) => (
          <path
            d={edge.path}
            stroke={edge.type === "relation" ? "purple" : "green"}
            fill="none"
            marker-end={
              edge.type === "relation"
                ? "url(#arrowhead-purple)"
                : "url(#arrowhead-green)"
            }
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
