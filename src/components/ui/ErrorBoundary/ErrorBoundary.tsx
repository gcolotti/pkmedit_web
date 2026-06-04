import React, { type ComponentType, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback: ComponentType<{ error: Error; retry: () => void }>
  onError?: (error: Error, info: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info)
  }

  retry = () => {
    this.setState({ error: null })
  }

  render() {
    if (this.state.error) {
      const { fallback: Fallback } = this.props
      return <Fallback error={this.state.error} retry={this.retry} />
    }
    return this.props.children
  }
}
