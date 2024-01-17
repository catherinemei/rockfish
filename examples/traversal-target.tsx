import { For, createSignal, onMount } from "solid-js";
import { TraversalGraph } from "./traversal";

type Id = string;

type GraphProps = {
  travGraph: TraversalGraph;
};

export const GraphVisualizer = (props: GraphProps) => {
  // Function to calculate positions and paths for nodes and edges
  const calculateLayout = (travGraph: TraversalGraph) => {
    const levels = new Map<Id, number>();
    let maxLevel = 0;

    // Assign levels to each node
    const assignLevel = (nodeId: Id, level: number) => {
      if (levels.has(nodeId)) return; // Already visited
      levels.set(nodeId, level);
      maxLevel = Math.max(maxLevel, level);

      const children = travGraph[nodeId]?.children || [];
      children.forEach((childId) => assignLevel(childId, level + 1));
    };

    // Start from root nodes (nodes without parents)
    Object.values(travGraph)
      .filter((node) => node.parents.length === 0)
      .forEach((rootNode) => {
        assignLevel(rootNode.id, 0);
      });

    // Calculate positions
    const nodePositions = new Map<
      Id,
      { x: number; y: number; description: string }
    >();
    const levelWidths = new Array(maxLevel + 1).fill(0);
    levels.forEach((level, nodeId) => {
      const position = levelWidths[level];
      nodePositions.set(nodeId, {
        x: position * 190 + 50,
        y: level * 100 + 50,
        description: travGraph[nodeId].description,
      });
      levelWidths[level] += 1;
    });

    // Calculate paths for edges
    const edges: { path: string }[] = [];
    Object.values(travGraph).forEach((node) => {
      const fromPos = nodePositions.get(node.id);
      node.children.forEach((childId) => {
        const toPos = nodePositions.get(childId);
        if (fromPos && toPos) {
          const path = `M ${fromPos.x + 50} ${fromPos.y + 20} L ${
            toPos.x + Math.floor(20 * Math.random()) + 50
          } ${toPos.y - 5}`;
          edges.push({ path });
        }
      });
    });

    return {
      nodes: Array.from(nodePositions, ([id, pos]) => ({ ...pos, id })),
      edges,
    };
  };

  const [layout, setLayout] = createSignal(calculateLayout(props.travGraph));

  onMount(() => {
    setLayout(calculateLayout(props.travGraph));
  });

  return (
    <svg width="1000" height="400">
      <For each={layout().nodes}>
        {(node) => (
          <g transform={`translate(${node.x}, ${node.y})`}>
            <rect width="180" height="20" fill="lightblue" />
            <text x="90" y="15" text-anchor="middle" aria-hidden={true}>
              {node.description}
            </text>
          </g>
        )}
      </For>
      <For each={layout().edges}>
        {(edge) => (
          <path
            d={edge.path}
            stroke="black"
            fill="none"
            marker-end="url(#arrowhead)"
          />
        )}
      </For>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="0"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="black" />
        </marker>
      </defs>
    </svg>
  );
};
