export function classnames(...classes: Array<string | undefined>): string {
  return classes.filter((el) => el).join(" ");
}

export function generateUniqueId(length = 16): string {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";

  const timestamp = Date.now().toString(36);

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }

  return timestamp + id;
}

export function getReactElementText(parent: any): string {
  if (typeof parent === "string") {
    return parent;
  }

  if (
    parent === null ||
    typeof parent !== "object" ||
    !parent.props ||
    !parent.props.children ||
    (typeof parent.props.children !== "string" &&
      typeof parent.props.children !== "object")
  ) {
    return "";
  }

  if (typeof parent.props.children === "string") {
    return parent.props.children;
  }

  return parent.props.children
    .map((child: any) => getReactElementText(child))
    .join("");
}
