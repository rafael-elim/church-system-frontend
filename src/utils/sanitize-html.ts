export function sanitizeHtml(html: string) {
  if (typeof window === "undefined") {
    return "";
  }

  const template = document.createElement("template");
  template.innerHTML = html;

  template.content.querySelectorAll("script, iframe, object, embed").forEach((node) => {
    node.remove();
  });

  template.content.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.toLowerCase();

      if (name.startsWith("on") || value.startsWith("javascript:")) {
        node.removeAttribute(attribute.name);
      }
    });
  });

  return template.innerHTML;
}
