// Node Interface
interface Node {
  id: string;
  name: string;
  children: Node[];
  parent?: Node;
}
