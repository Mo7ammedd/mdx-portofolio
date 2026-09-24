import { cn } from '@/lib/utils'

export type ProjectVisualKind =
  | 'gateway'
  | 'scheduler'
  | 'storage'
  | 'replication'
  | 'services'
  | 'transport'

const LABELS: Record<ProjectVisualKind, string> = {
  gateway:
    'Conceptual LLMProxy request flow. A client sends requests through a gateway that enforces quotas and routes to a compatible provider, illustrated by OpenAI, Gemini, and Ollama.',
  scheduler:
    'Illustrative Round Robin schedule, not live data. Three processes each need four time units and take turns in two-unit slices, completing after twelve units.',
  storage:
    'Conceptual LSMSharp write path: write-ahead log, memtable, then immutable SSTables. Compaction merges sorted disk tables. This is an architecture sketch, not a measurement.',
  replication:
    'Conceptual Disk-Mesh architecture. A master coordinates three storage nodes; a chunk is replicated along the chain from node one to node two to node three. Dashed lines represent coordination, not the chunk data path.',
  services:
    'Conceptual HungerStation order event flow. The order service publishes through an Azure Service Bus topic, and the rewards service consumes the message. This is an architecture sketch, not live activity.',
  transport:
    'Illustrative AeroUDP packet exchange, not live traffic. Packet one reaches the receiver and is acknowledged. Packet two is lost and then retransmitted.',
}

const INK = '#d4d4d4'
const MUTED = '#a3a3a3'
const LINE = '#8a8a8a'
const BORDER = '#525252'
const GRID = '#404040'
const ACCENT = 'var(--primary)'

function Node({
  x,
  y,
  width,
  height = 40,
  lines,
  highlighted = false,
}: {
  x: number
  y: number
  width: number
  height?: number
  lines: readonly string[]
  highlighted?: boolean
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="4"
        fill={highlighted ? ACCENT : '#222222'}
        fillOpacity={highlighted ? 0.08 : 1}
        stroke={highlighted ? ACCENT : BORDER}
        strokeWidth="1.25"
      />
      <text
        x={x + width / 2}
        y={y + height / 2 + 5 - (lines.length - 1) * 10}
        fill={highlighted ? ACCENT : INK}
        textAnchor="middle"
      >
        {lines.map((line, index) => (
          <tspan key={line} x={x + width / 2} dy={index === 0 ? 0 : 20}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}

function SchedulerVisual() {
  const rows = [
    { label: 'P1', y: 48, slices: [0, 3], fill: ACCENT },
    { label: 'P2', y: 80, slices: [1, 4], fill: '#a3a3a3' },
    { label: 'P3', y: 112, slices: [2, 5], fill: '#8a8a8a' },
  ]

  return (
    <>
      <text x="16" y="25" fill={INK}>
        Round Robin
      </text>
      <text x="304" y="25" textAnchor="end">
        q = 2
      </text>
      {[0, 2, 4, 6].map((slice) => (
        <g key={slice}>
          <path
            d={`M${56 + slice * 41} 41V144`}
            stroke={GRID}
            strokeDasharray="3 5"
          />
          <text x={56 + slice * 41} y="166" textAnchor="middle">
            {slice * 2}
          </text>
        </g>
      ))}
      {rows.map((row) => (
        <g key={row.label}>
          <text x="16" y={row.y + 19}>
            {row.label}
          </text>
          <path d={`M56 ${row.y + 14}H302`} stroke={GRID} strokeWidth="1" />
          {row.slices.map((slice) => (
            <rect
              key={slice}
              x={57 + slice * 41}
              y={row.y}
              width="39"
              height="28"
              rx="3"
              fill={row.fill}
            />
          ))}
        </g>
      ))}
    </>
  )
}

function StorageVisual() {
  return (
    <>
      <Node x={12} y={40} width={58} lines={['WAL']} />
      <Node x={96} y={40} width={102} lines={['memtable']} highlighted />
      <rect
        x="230"
        y="34"
        width="80"
        height="40"
        rx="4"
        fill="none"
        stroke={BORDER}
        strokeWidth="1.25"
      />
      <Node x={224} y={40} width={80} lines={['SSTable']} />
      <Node x={16} y={112} width={130} lines={['merged table']} />
      <g fill="none" stroke={ACCENT} strokeWidth="1.5">
        <path d="M75 60H90M85 55L90 60L85 65" />
        <path d="M203 60H218M213 55L218 60L213 65" />
        <path d="M264 86V132H153M158 127L153 132L158 137" />
      </g>
      <text x="225" y="162" textAnchor="middle">
        compaction
      </text>
    </>
  )
}

function ReplicationVisual() {
  return (
    <>
      <Node x={110} y={14} width={100} lines={['master']} highlighted />
      <path
        d="M160 60V98M160 78H56V98M160 78H264V98"
        fill="none"
        stroke={BORDER}
        strokeWidth="1.25"
        strokeDasharray="3 5"
      />
      {[16, 120, 224].map((x, index) => (
        <Node
          key={x}
          x={x}
          y={106}
          width={80}
          height={48}
          lines={[`N${index + 1}`, 'chunk']}
        />
      ))}
      <g fill="none" stroke={ACCENT} strokeWidth="1.5">
        <path d="M101 130H114M109 125L114 130L109 135" />
        <path d="M205 130H218M213 125L218 130L213 135" />
      </g>
      <text x="160" y="176" textAnchor="middle">
        chain replication
      </text>
    </>
  )
}

function ServicesVisual() {
  return (
    <>
      <Node x={16} y={24} width={94} lines={['Order']} />
      <Node
        x={144}
        y={66}
        width={160}
        height={52}
        lines={['Azure', 'Service Bus']}
        highlighted
      />
      <Node x={16} y={124} width={94} lines={['Rewards']} />
      <g fill="none" stroke={ACCENT} strokeWidth="1.5">
        <path d="M116 44H224V60M219 55L224 60L229 55" />
        <path d="M224 124V144H116M121 139L116 144L121 149" />
      </g>
      <text x="224" y="169" textAnchor="middle">
        order event
      </text>
    </>
  )
}

function TransportVisual() {
  return (
    <>
      <text x="43" y="24" fill={INK} textAnchor="middle">
        sender
      </text>
      <text x="277" y="24" fill={INK} textAnchor="middle">
        receiver
      </text>
      <path d="M43 38V167M277 38V167" stroke={BORDER} strokeWidth="1.25" />
      <g fill="none" stroke={LINE} strokeWidth="1.5">
        <path d="M49 58H271M266 53L271 58L266 63" stroke={ACCENT} />
        <path d="M271 87H49M54 82L49 87L54 92" stroke={ACCENT} />
        <path d="M49 117H151" strokeDasharray="4 5" />
        <path d="M156 112L166 122M166 112L156 122" />
        <path d="M49 153H271M266 148L271 153L266 158" stroke={ACCENT} />
      </g>
      <text x="160" y="51" textAnchor="middle">
        packet 1
      </text>
      <text x="160" y="80" textAnchor="middle">
        ACK
      </text>
      <text x="110" y="109" textAnchor="middle">
        packet 2
      </text>
      <text x="210" y="122" textAnchor="middle">
        lost
      </text>
      <text x="160" y="145" fill={ACCENT} textAnchor="middle">
        retry
      </text>
    </>
  )
}

function GatewayVisual() {
  return (
    <>
      <Node x={12} y={70} width={74} lines={['client']} />
      <Node x={110} y={70} width={94} lines={['proxy']} highlighted />
      {['OpenAI', 'Gemini', 'Ollama'].map((provider, index) => (
        <Node
          key={provider}
          x={236}
          y={14 + index * 56}
          width={76}
          lines={[provider]}
        />
      ))}
      <g fill="none" stroke={ACCENT} strokeWidth="1.5">
        <path d="M92 90H104M99 85L104 90L99 95" />
        <path d="M210 90H220M220 34V146" />
        {[34, 90, 146].map((y) => (
          <path
            key={y}
            d={`M220 ${y}H230M225 ${y - 5}L230 ${y}L225 ${y + 5}`}
          />
        ))}
      </g>
      <text x="157" y="51" textAnchor="middle">
        routing
      </text>
      <text x="157" y="139" textAnchor="middle">
        quotas
      </text>
    </>
  )
}

const DIAGRAMS = {
  gateway: GatewayVisual,
  scheduler: SchedulerVisual,
  storage: StorageVisual,
  replication: ReplicationVisual,
  services: ServicesVisual,
  transport: TransportVisual,
} satisfies Record<ProjectVisualKind, () => React.JSX.Element>

export function ProjectVisual({
  kind,
  className,
}: {
  kind: ProjectVisualKind
  className?: string
}) {
  const Diagram = DIAGRAMS[kind]

  return (
    <svg
      role="img"
      aria-label={LABELS[kind]}
      viewBox="0 0 320 180"
      width="320"
      height="180"
      fill={MUTED}
      fontSize="16"
      focusable="false"
      className={cn('block h-auto w-full font-mono', className)}
    >
      <g aria-hidden="true">
        <Diagram />
      </g>
    </svg>
  )
}
