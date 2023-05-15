// import rehypeShiki from "@stefanprobst/rehype-shiki";
import MarkdownIt from "markdown-it";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const RenderMarkdown = ({ children }: { children: string }) => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  return (
    <ReactMarkdown
      className="prose max-w-none text-sm text-black overflow-x-auto"
      remarkPlugins={[remarkGfm]}
      // rehypePlugins={[rehypeShiki]}
    >
      {children}
    </ReactMarkdown>
  );
};

export default RenderMarkdown;
