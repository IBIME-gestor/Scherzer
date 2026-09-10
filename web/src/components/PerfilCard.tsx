interface PerfilCardProps {
  nombre: string
  matricula?: string
  fotoUrl?: string
  subtitulo?: string
  etiqueta?: string
  onClick?: () => void
}

export function PerfilCard({ nombre, matricula, fotoUrl, subtitulo, etiqueta, onClick }: PerfilCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-black/5 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {fotoUrl ? (
        <img src={fotoUrl} alt={nombre} className="h-14 w-14 flex-shrink-0 rounded-full object-cover" />
      ) : (
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-scherzer-rojo/10 font-display text-lg font-bold text-scherzer-rojo">
          {nombre[0]}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display font-semibold text-scherzer-negro">{nombre}</p>
        {subtitulo && <p className="truncate text-sm text-black/50">{subtitulo}</p>}
        {matricula && (
          <p className="mt-1 inline-block rounded bg-scherzer-gris px-2 py-0.5 font-mono text-xs text-black/60">
            {matricula}
          </p>
        )}
      </div>
      {etiqueta && (
        <span className="flex-shrink-0 rounded-full bg-scherzer-amarillo/20 px-3 py-1 text-xs font-semibold text-scherzer-rojoOscuro">
          {etiqueta}
        </span>
      )}
    </button>
  )
}
