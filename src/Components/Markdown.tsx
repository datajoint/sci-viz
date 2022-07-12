import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Card } from 'antd'

interface MarkdownProps {
  content: string
  height: number
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
      <Card
        style={{
          backgroundImage: 'url(' + this.props.imageRoute + ')',
          backgroundSize: '100% 100%',
          height: this.props.height,
        }}
        bodyStyle={{ overflow: 'auto', height: '100%' }}
        hoverable={true}
      >
        <ReactMarkdown
          className="markdown"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
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
      </Card>
    )
  }
}
