// Node Interface
export class Node {
  constructor({
    id,
    name,
    depth,
    children,
    parent,
    isCollapsed,
    isDraggable,
    isDragging,
    dropzone,
  }) {
    this.id = id;
    this.name = name;
    this.depth = depth || 0;
    this.children = children || [];
    this.parent = parent || null;
    this.isCollapsed = isCollapsed || true;
    this.isDraggable = isDraggable || true;
    this.isDragging = isDragging || false;
    this.dropzone = dropzone || null;
  }
}
