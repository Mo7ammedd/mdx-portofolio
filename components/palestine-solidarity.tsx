import { ChevronDown } from 'lucide-react'

export function PalestineSolidarity() {
  return (
    <details className="group mt-2">
      <summary className="inline-flex min-h-10 cursor-pointer list-none items-center gap-2 rounded-sm text-xs text-zinc-400 transition-colors hover:text-zinc-100 [&::-webkit-details-marker]:hidden">
        <span>Standing with Palestine 🇵🇸</span>
        <ChevronDown
          aria-hidden="true"
          className="size-3 transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="max-w-md space-y-2 pt-1 pb-3 text-xs leading-6 text-zinc-400">
        <p className="text-zinc-300">
          From the river to the sea. We remember Gaza.
        </p>
        <p>
          Supporting justice, human rights, and the dignity of all people.
          Technology should empower communities and promote peace worldwide.
        </p>
      </div>
    </details>
  )
}
