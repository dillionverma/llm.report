import type MarkdownIt from "markdown-it";

// https://github.com/vuejs/vitepress/blob/0561c8fc4164bdd030dbbe75fc8d8d0ed732a89e/src/node/markdown/plugins/lineNumbers.ts
export const lineNumberPlugin = (md: MarkdownIt, enable = false) => {
  const fence = md.renderer.rules.fence!;
  md.renderer.rules.fence = (...args) => {
    const rawCode = fence(...args);

    const [tokens, idx] = args;
    const info = tokens[idx].info;

    if (
      (!enable && !/:line-numbers($| )/.test(info)) ||
      (enable && /:no-line-numbers($| )/.test(info))
    ) {
      return rawCode;
    }

    const code = rawCode.slice(
      rawCode.indexOf("<code>"),
      rawCode.indexOf("</code>")
    );

    const lines = code.split("\n");

    const lineNumbersCode = [...Array(lines.length)]
      .map((_, index) => `<span class="line-number">${index + 1}</span><br>`)
      .join("");

    const lineNumbersWrapperCode = `<div class="line-numbers-wrapper" aria-hidden="true">${lineNumbersCode}</div>`;

    const finalCode = rawCode
      .replace(/<\/div>$/, `${lineNumbersWrapperCode}</div>`)
      .replace(/"(language-[^"]*?)"/, '"$1 line-numbers-mode"');

    return finalCode;
  };
};
