import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

/**
 * Sin esto, cualquier error de JavaScript durante el render deja la
 * pantalla completamente en blanco y sin pistas. Con esto, se muestra
 * el mensaje de error para poder diagnosticarlo rápido.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error atrapado por ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-scherzer-negro px-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h1 className="font-display text-lg font-bold text-scherzer-rojo">Ocurrió un error</h1>
            <p className="mt-2 text-sm text-black/60">
              Algo falló al cargar esta parte de la plataforma. Copia este mensaje y compártelo para
              corregirlo:
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-scherzer-gris p-3 text-xs text-black/70">
              {this.state.error.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-scherzer-rojo px-4 py-2 text-sm font-semibold text-white hover:bg-scherzer-rojoOscuro"
            >
              Recargar página
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
