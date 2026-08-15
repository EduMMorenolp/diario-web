import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Renderiza el cuerpo de una nota como Markdown real (GFM: tablas, listas,
 * codigo, blockquotes, enfasis). Mapea los h1 internos del body a h2 para
 * mantener una jerarquia limpia dentro de <article> (el titulo ya es h1).
 *
 * Seguridad:
 * - Los enlaces se abren en pestana nueva con `rel="noopener noreferrer"`.
 * - react-markdown no ejecuta HTML crudo (solo lo que este componente mapea).
 */
export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <div className={`markdown ${className ?? ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: "h2",
          a: ({ node: _node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
          pre: ({ node: _node, ...props }) => <pre {...props} />,
          code: ({ node: _node, className: codeClass, children }) => {
            const isBlock = Boolean(codeClass?.includes("language-"));
            if (!isBlock) {
              return <code className={codeClass}>{children}</code>;
            }
            const lang = (codeClass ?? "").replace("language-", "").trim();
            return (
              <div className="codeblock">
                {lang && <span className="codeblock-lang">{lang}</span>}
                <code className={codeClass}>{children}</code>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
