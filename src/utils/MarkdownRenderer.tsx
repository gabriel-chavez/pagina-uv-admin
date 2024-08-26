import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkBreaks from 'remark-breaks';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      children={content}
      rehypePlugins={[rehypeSanitize]}
      remarkPlugins={[remarkBreaks]}
    />
  );
};

export default MarkdownRenderer;
