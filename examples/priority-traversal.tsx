import { For, createSignal, Show, createMemo, createEffect } from "solid-js";
import dagre from "dagre";

type Id = string;

export type RelationNode = {
  id: Id;
  displayName: string;
  description?: string;
  parents: Id[];
  children: Id[];
  priority: number;
};

export type Hypergraph = {
  [id: Id]: RelationNode;
};

/**
 * Component to output the traversal structure to the DOM
 * Contains both the visualization for the traversal structure (optional) and
 * also screen reader output for traversal structure
 */

export type TraversalOutputProps = {
  nodeGraph: Hypergraph;
  showHypergraph?: boolean;
};
export function TraversalOutputComponent(props: TraversalOutputProps) {
  const [currentNodeId, setCurrentNodeId] = createSignal<string | null>(
    props.nodeGraph[0].id
  );

  const handleNodeClick = (id: string) => {
    setCurrentNodeId(id);
  };

  const currentNode = createMemo(() => {
    if (currentNodeId() !== null) {
      return props.nodeGraph[currentNodeId() as string];
    }
    return props.nodeGraph[0]; // Default to the first node if none is selected
  });

  return (
    <div>
      <Show when={props.showHypergraph}>
        <VisualizerComponent nodeGraph={props.nodeGraph} />
      </Show>
      <Show when={currentNodeId()}>
        <HypergraphNodeComponent
          node={currentNode() as RelationNode}
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
export type HypergraphNodeProps = {
  node: RelationNode;
  nodeGraph: Hypergraph;
  onNodeClick: (id: string) => void;
};

export function HypergraphNodeComponent(props: HypergraphNodeProps) {
  const sortedParents = createMemo(() =>
    props.node.parents
      .map((parentId) => props.nodeGraph[parentId])
      .sort((a, b) => a.priority - b.priority)
  );

  const sortedChildren = createMemo(() =>
    props.node.children
      .map((childId) => props.nodeGraph[childId])
      .sort((a, b) => a.priority - b.priority)
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>{props.node.displayName}</h2>
      <p>{props.node.description}</p>
      <p>Node ID: {props.node.id}</p>
      <p>Node Priority: {props.node.priority}</p>
      <div>
        <span style={{ "font-weight": "bold" }}>Parents </span>
        <For
          each={sortedParents()}
          fallback={<span style={{ color: "grey" }}> None</span>}
        >
          {(parent) => (
            <button
              onClick={() => props.onNodeClick(parent.id)}
              style={{ "margin-right": "5px" }}
            >
              {parent.displayName}
            </button>
          )}
        </For>
      </div>
      <div style={{ "margin-top": "10px" }}>
        <span style={{ "font-weight": "bold" }}>Children </span>
        <For
          each={sortedChildren()}
          fallback={<span style={{ color: "grey" }}> None</span>}
        >
          {(child) => (
            <button
              onClick={() => props.onNodeClick(child.id)}
              style={{ "margin-right": "5px" }}
            >
              {child.displayName}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}

/**
 * Component to visualize the traversal structure
 * Uses dagre to place nodes
 */
export type VisualizerProps = {
  nodeGraph: Hypergraph;
};

export function VisualizerComponent(props: VisualizerProps) {
  // This function would be implemented to render the graph using dagre
  // Placeholder for visualization logic

  createEffect(() => {
    const graph = new dagre.graphlib.Graph();
    graph.setGraph({});
    graph.setDefaultEdgeLabel(() => ({}));

    Object.values(props.nodeGraph).forEach((node) => {
      graph.setNode(node.id, {
        label: node.displayName,
        width: 100,
        height: 50,
      });
      node.children.forEach((childId) => {
        graph.setEdge(node.id, childId);
      });
    });

    dagre.layout(graph);

    // render graph in DOM using your preferred method
    // e.g., using d3 or directly manipulating the DOM
  }, [props.nodeGraph]);

  return (
    <div id="graph-container">
      {/* Placeholder for actual graph rendering */}
    </div>
  );
}
