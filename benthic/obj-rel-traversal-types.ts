export type Id = string;
export type ObjectNode = {
  id: Id;
  displayName: string;
  nodeType: "object" | "relation";
  description: string;
  parentId: Id;
  children: Id[];
  relations: Id[];
};

export type RelationNode = {
  id: Id;
  displayName: string;
  nodeType: "object" | "relation";
  description: string;
  members: Id[];
};

export type NodeMap = {
  [id: string]: ObjectNode | RelationNode;
};

export type ObjectComponentProps = {
  objectId: Id;
  nodeMap: NodeMap;
  onNodeClick: (nodeId: Id) => void;
};

export type RelationComponentProps = {
  relationId: Id;
  nodeMap: NodeMap;
  onMemberClick: (member: Id) => void;
};

export type TraverseObjRelComponentProps = {
  nodeGraph: NodeMap;
  showGraph?: boolean;
};
