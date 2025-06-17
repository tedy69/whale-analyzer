import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import type { Components } from 'react-markdown';

interface MarkdownProps {
  readonly children: string;
  readonly className?: string;
}

// Define components outside of the main component
const markdownComponents: Components = {
  // Custom styling for markdown elements with enhanced readability
  strong: ({ children }) => (
    <strong className='font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent'>
      {children}
    </strong>
  ),
  em: ({ children }) => <em className='italic text-current opacity-90'>{children}</em>,
  code: ({ children }) => (
    <code className='bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 px-2 py-1 rounded-md text-sm font-mono text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700/50 shadow-sm'>
      {children}
    </code>
  ),
  p: ({ children }) => (
    <p className='text-current mb-4 last:mb-0 leading-relaxed text-base'>{children}</p>
  ),
  br: () => <br className='my-2' />,
  // Headers with enhanced styling and spacing
  h1: ({ children }) => (
    <h1 className='font-bold text-xl mb-4 mt-6 first:mt-0 text-gray-900 dark:text-gray-100'>
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className='font-bold text-lg mb-3 mt-5 first:mt-0 text-gray-900 dark:text-gray-100'>
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className='font-semibold mb-2 mt-4 first:mt-0 text-gray-800 dark:text-gray-200'>
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className='font-semibold mb-2 mt-3 first:mt-0 text-gray-800 dark:text-gray-200'>
      {children}
    </h4>
  ),
  h5: ({ children }) => (
    <h5 className='font-medium mb-1 mt-2 first:mt-0 text-gray-700 dark:text-gray-300'>
      {children}
    </h5>
  ),
  h6: ({ children }) => (
    <h6 className='font-medium mb-1 mt-2 first:mt-0 text-gray-700 dark:text-gray-300'>
      {children}
    </h6>
  ),
  // Enhanced lists with better spacing and styling
  ul: ({ children }) => <ul className='list-none text-current space-y-2 mb-4 pl-0'>{children}</ul>,
  ol: ({ children }) => (
    <ol className='list-none text-current space-y-2 mb-4 pl-0 counter-reset-none'>{children}</ol>
  ),
  li: ({ children }) => (
    <li className='text-current flex items-start gap-2 py-1'>
      <span className='text-current'>{children}</span>
    </li>
  ),
  // Links styled as text for security with hover effects
  a: ({ children }) => (
    <span className='text-current font-medium underline decoration-dotted hover:decoration-solid transition-all duration-200 cursor-default'>
      {children}
    </span>
  ),
  // Blockquotes for special callouts
  blockquote: ({ children }) => (
    <blockquote className='border-l-4 border-blue-400 dark:border-blue-500 pl-4 py-2 my-4 bg-blue-50/50 dark:bg-blue-900/20 italic text-current rounded-r-lg'>
      {children}
    </blockquote>
  ),
  // Tables for structured data
  table: ({ children }) => (
    <div className='overflow-x-auto my-4'>
      <table className='min-w-full border-collapse border border-gray-300 dark:border-gray-700 rounded-lg'>
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className='border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left'>
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className='border border-gray-300 dark:border-gray-700 px-4 py-2'>{children}</td>
  ),
  // Horizontal rules
  hr: () => <hr className='my-6 border-t-2 border-gray-200 dark:border-gray-700 rounded' />,
};

export function Markdown({ children, className = '' }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={markdownComponents}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
