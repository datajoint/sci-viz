import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownProps {
  content: string
  imageRoute?: string
}

/**
 * Markdown component
 */
export default class Markdown extends React.Component<MarkdownProps> {
  constructor(props: MarkdownProps) {
    super(props)
  }
  render() {
    return (
      <div
        className="markdownContainer"
        style={{
          backgroundImage: 'url(' + this.props.imageRoute + ')',
          backgroundSize: '100% 100%',
        }}
      >
        <ReactMarkdown
          className="markdown"
          remarkPlugins={[remarkGfm]}
          children={this.props.content}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  style={solarizedlight}
                  language={match[1]}
                  PreTag="div"
                />
              ) : (
                <code
                  style={{
                    background: 'rgb(222,222,222)',
                    color: 'red',
                  }}
                  className={className}
                  {...props}
                >
                  {children}
                </code>
              )
            },
          }}
        />
      </div>
    )
  }
}
