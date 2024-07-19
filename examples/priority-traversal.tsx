import { For, createSignal, Show, createMemo, onMount } from "solid-js";
import * as d3 from "d3";
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

  const handleNodeClick = (oldId: string, newId: string) => {
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
  onNodeClick: (curId: string, newId: string) => void;
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
      <div
        id={props.node.id}
        aria-label={`${props.node.displayName} node with ${props.node.parents.length} parent and ${props.node.children.length} children nodes; ${props.node.description}.`}
      >
        <h2 aria-hidden={true}>{props.node.displayName}</h2>
        <p aria-hidden={true}>{props.node.description}</p>
      </div>
      <div
        aria-label={`Parent relations: ${props.node.parents.length}.`}
        tabindex="0"
      >
        <span style={{ "font-weight": "bold" }} aria-hidden={true}>
          Parents{" "}
        </span>
        <For
          each={sortedParents()}
          fallback={
            <span style={{ color: "grey" }} aria-hidden={true}>
              {" "}
              None
            </span>
          }
        >
          {(parent) => (
            <button
              onClick={() => props.onNodeClick(props.node.id, parent.id)}
              style={{ "margin-right": "5px" }}
              aria-label={parent.description}
            >
              <span aria-hidden={true}>{parent.displayName}</span>
            </button>
          )}
        </For>
      </div>
      <div
        style={{ "margin-top": "10px" }}
        aria-label={`Child relations: ${props.node.children.length}.`}
        tabindex="0"
      >
        <span style={{ "font-weight": "bold" }} aria-hidden={true}>
          Children{" "}
        </span>
        <For
          each={sortedChildren()}
          fallback={
            <span style={{ color: "grey" }} aria-hidden={true}>
              {" "}
              None
            </span>
          }
        >
          {(child) => (
            <button
              onClick={() => props.onNodeClick(props.node.id, child.id)}
              style={{ "margin-right": "5px" }}
              aria-label={child.description}
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
export type VisualizerProps = {
  nodeGraph: Hypergraph;
};

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
