import {
  Hypergraph,
  HypergraphWithSibling,
  Id,
} from "./priority-traversal-types";

export function findNodesOnSameLevel(
  currentNodeId: Id,
  hypergraph: HypergraphWithSibling
): Set<Id> {
  const visited = new Set<Id>();
  const result = new Set<Id>();

  function explore(nodeId: Id) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    result.add(nodeId);

    const node = hypergraph[nodeId];
    if (!node) return;

    node.siblings.forEach((siblingId) => {
      if (!visited.has(siblingId)) {
        explore(siblingId);
      }
    });
  }

  explore(currentNodeId);
  return result;
}

export function addSiblingsToHypergraph(
  hypergraph: Hypergraph
): HypergraphWithSibling {
  const hypergraphWithSiblings: HypergraphWithSibling = {};

  // Iterate over each node in the hypergraph
  for (const nodeId in hypergraph) {
    const node = hypergraph[nodeId];
    const siblingSet = new Set<Id>();

    // Iterate over each parent of the current node
    node.parents.forEach((parentId) => {
      // Find all nodes that share this parent
      for (const potentialSiblingId in hypergraph) {
        const potentialSibling = hypergraph[potentialSiblingId];

        // Check if the potential sibling shares the same parent but is not the current node itself
        if (
          potentialSiblingId !== nodeId &&
          potentialSibling.parents.includes(parentId)
        ) {
          siblingSet.add(potentialSiblingId);
        }
      }
    });

    // Convert the Set to an array and assign it to the node's siblings
    hypergraphWithSiblings[nodeId] = {
      ...node,
      siblings: Array.from(siblingSet),
    };
  }

  return hypergraphWithSiblings;
}
