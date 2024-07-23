export type Id = string;

export type Description = {
  label: string;
  color?: string;
  objectType?: string; // shape, text, image, etc
  role?: string; // main concept, sub-concept, connector, etc
  longDescription?: string;
  shortDescription?: string;
};

export type RelationNode = {
  id: Id;
  displayName: string;
  description?: string;
  descriptionTokens?: Description;
  parents: Id[];
  children: Id[];
  priority: number;
};

export type Hypergraph = {
  [id: Id]: RelationNode;
};

export type TraversalOutputProps = {
  nodeGraph: Hypergraph;
  showHypergraph?: boolean;
};

export type HypergraphNodeProps = {
  node: RelationNode;
  nodeGraph: Hypergraph;
  onNodeClick: (curId: string, newId: string) => void;
};

export type VisualizerProps = {
  nodeGraph: Hypergraph;
};
