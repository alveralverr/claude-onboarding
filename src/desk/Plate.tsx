import { PLATE } from "./plateConfig"

const pts = (q: number[][]) => q.map((p) => p.join(",")).join(" ")

/* Drawn stand-in for the rendered desk, in the office's clay palette. */
export function Plate() {
  if (PLATE.src) return <img src={PLATE.src} alt="" width={PLATE.w} height={PLATE.h} className="absolute inset-0 size-full" />
  const s = PLATE.screen
  const bezel = [
    [s[0][0] - 16, s[0][1] - 16],
    [s[1][0] + 16, s[1][1] - 16],
    [s[2][0] + 18, s[2][1] + 14],
    [s[3][0] - 18, s[3][1] + 14],
  ]
  const ph = PLATE.phone
  const phoneBody = [
    [ph[0][0] - 8, ph[0][1] - 10],
    [ph[1][0] + 8, ph[1][1] - 10],
    [ph[2][0] + 10, ph[2][1] + 14],
    [ph[3][0] - 8, ph[3][1] + 14],
  ]
  return (
    <svg viewBox={`0 0 ${PLATE.w} ${PLATE.h}`} className="absolute inset-0 size-full" aria-hidden="true">
      <defs>
        <radialGradient id="deskglow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#754EFF" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#754EFF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1536" height="650" fill="#ECEAF8" />
      <rect width="1536" height="650" fill="url(#deskglow)" />
      <rect x="1060" y="70" width="380" height="300" rx="20" fill="#E4F7F8" stroke="#D6D2EE" strokeWidth="10" />
      <line x1="1250" y1="75" x2="1250" y2="365" stroke="#D6D2EE" strokeWidth="8" />
      <line x1="1065" y1="220" x2="1435" y2="220" stroke="#D6D2EE" strokeWidth="8" />
      <circle cx={PLATE.clock.x} cy={PLATE.clock.y} r={PLATE.clock.r + 10} fill="#FFFFFF" stroke="#D6D2EE" strokeWidth="8" />
      <rect x={PLATE.board.x} y={PLATE.board.y} width={PLATE.board.w} height={PLATE.board.h} rx="14" fill="#E8D3B8" stroke="#FFFFFF" strokeWidth="10" />
      <rect x={PLATE.board.x + 28} y={PLATE.board.y + 34} width="96" height="74" rx="6" fill="#DCCBFF" transform={`rotate(-4 ${PLATE.board.x + 76} ${PLATE.board.y + 71})`} />
      <rect x={PLATE.board.x + 150} y={PLATE.board.y + 44} width="100" height="70" rx="6" fill="#FFD6E1" transform={`rotate(3 ${PLATE.board.x + 200} ${PLATE.board.y + 79})`} />
      <rect x={PLATE.board.x + 88} y={PLATE.board.y + 118} width="110" height="66" rx="6" fill="#CDF6F7" transform={`rotate(-2 ${PLATE.board.x + 143} ${PLATE.board.y + 151})`} />
      <circle cx={PLATE.board.x + 76} cy={PLATE.board.y + 40} r="7" fill="#FFFFFF" stroke="#C9C5E0" strokeWidth="3" />
      <circle cx={PLATE.board.x + 200} cy={PLATE.board.y + 50} r="7" fill="#FFFFFF" stroke="#C9C5E0" strokeWidth="3" />
      <rect x="120" y="360" width="280" height="14" rx="4" fill="#DCC3AA" />
      <rect x="160" y="300" width="50" height="60" rx="10" fill="#FFFFFF" stroke="#D6D2EE" strokeWidth="4" />
      <ellipse cx="185" cy="292" rx="34" ry="22" fill="#3CC47C" />
      <rect x="250" y="310" width="30" height="50" rx="4" fill="#754EFF" />
      <rect x="285" y="320" width="26" height="40" rx="4" fill="#FF8EA9" />
      <rect x="315" y="300" width="24" height="60" rx="4" fill="#14E9ED" />
      <rect y="630" width="1536" height="394" fill="#EAD9C6" />
      <rect y="630" width="1536" height="22" fill="#DCC3AA" />
      <polygon points={pts([[430, 604], [1106, 604], [1214, 800], [322, 800]])} fill="#DEDBEC" stroke="#C9C5E0" strokeWidth="4" />
      <polygon points={pts([[468, 624], [1068, 624], [1140, 730], [396, 730]])} fill="#CFCBE3" />
      <polygon points={pts([[700, 744], [836, 744], [846, 786], [690, 786]])} fill="#D6D3E8" />
      <polygon points={pts(bezel)} fill="#24233A" />
      <polygon points={pts(s)} fill="#F7F6FB" />
      <polygon points={pts(phoneBody)} fill="#24233A" />
      <polygon points={pts(ph)} fill="#2F2E47" />
      <polygon points={pts([[1060, 850], [1200, 840], [1228, 990], [1082, 1004]])} fill="#5200E3" />
      <line x1="1180" y1="842" x2="1206" y2="992" stroke="#3E00B0" strokeWidth="6" />
      <ellipse cx="1450" cy="905" rx="58" ry="16" fill="#D8C4AE" />
      <rect x="1398" y="800" width="104" height="104" rx="18" fill="#FFFFFF" stroke="#E2DEF2" strokeWidth="4" />
      <rect x="1398" y="838" width="104" height="22" fill="#754EFF" />
      <path d="M1502 822 q36 6 30 38 q-6 28 -30 26" fill="none" stroke="#E2DEF2" strokeWidth="12" strokeLinecap="round" />
      <path d="M1430 780 q-14 -22 4 -40 M1462 780 q-14 -22 4 -40" fill="none" stroke="#C9C5E0" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}
