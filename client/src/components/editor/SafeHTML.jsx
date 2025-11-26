import React, { useEffect } from 'react';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

const SafeHTML = ({ html, className = "" }) => {
  useEffect(() => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [html]);

  const sanitizeHTML = (dirty) => {
    const config = {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 
        'code', 'pre', 'span', 'div',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote',
        'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'
      ],
      ALLOWED_ATTR: [
        'href', 'target', 'rel', 'src', 'alt', 'title', 'class',
        'width', 'height'
      ]
    };

    let clean = DOMPurify.sanitize(dirty || '', config);
    clean = clean
      .replace(/<pre><code(.*?)>(.*?)<\/code><\/pre>/g, (match, attrs, codeContent) => {
        const decoded = codeContent
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
        return `<pre><code${attrs} class="hljs">${decoded}</code></pre>`;
      })
      .replace(/<pre>(.*?)<\/pre>/g, (match, preContent) => {
        const decoded = preContent
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&');
        return `<pre class="hljs">${decoded}</pre>`;
      });

    return clean;
  };

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHTML(html) }} 
    />
  );
};

export default SafeHTML;