import { ObjectRelationNodeComponent } from "./obj-rel-traversal";

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

export type ObjectRelationNodeComponentProps = {
  node: ObjectNode | RelationNode;
  nodeMap: NodeMap;
  onButtonClick: (oldId: Id, newId: Id) => void;
};

export type TraverseObjRelComponentProps = {
  nodeGraph: NodeMap;
  showGraph?: boolean;
};

// Combined two component types into one component so don't need this anymore
// export type ObjectComponentProps = {
//   objectNode: ObjectNode;
//   nodeMap: NodeMap;
//   onButtonClick: (oldId: Id, newId: Id) => void;
// };

// export type RelationComponentProps = {
//   relationNode: RelationNode;
//   nodeMap: NodeMap;
//   onButtonClick: (oldId: Id, newId: Id) => void;
// };
