// A static picture of the in-app spin wheel (cuisines mode), drawn as SVG.
// `lit` colours slices: "hot" = bright orange (the pick), "warm" = darker orange (the slices it just passed).
const CUISINES = ["Mexican", "Thai", "Japanese", "Korean", "Chinese", "Italian", "Vietnamese", "Indian"];

type Lit = Partial<Record<string, "hot" | "warm">>;

const C = 167; // centre
const R = 165; // outer radius
const HOLE = 14; // centre hole radius
const GAP = 2; // half gap between slices, in px

function polar(r: number, deg: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
}

function slicePath(i: number) {
  const a0 = i * 45;
  const a1 = (i + 1) * 45;
  // shrink each side by the gap, measured in degrees at the outer radius
  const outerPad = (GAP / R) * (180 / Math.PI);
  const innerPad = (GAP / HOLE) * (180 / Math.PI);
  const [ox0, oy0] = polar(R, a0 + outerPad);
  const [ox1, oy1] = polar(R, a1 - outerPad);
  const [ix1, iy1] = polar(HOLE + 22, a1 - Math.min(innerPad, 8));
  const [ix0, iy0] = polar(HOLE + 22, a0 + Math.min(innerPad, 8));
  return `M${ix0} ${iy0} L${ox0} ${oy0} A${R} ${R} 0 0 1 ${ox1} ${oy1} L${ix1} ${iy1} A${HOLE + 22} ${HOLE + 22} 0 0 0 ${ix0} ${iy0}Z`;
}

export default function SpinWheel({ lit = {}, label }: { lit?: Lit; label: string }) {
  return (
    <svg
      className="wheel"
      viewBox="0 0 334 334"
      role="img"
      aria-label={label}
    >
      {CUISINES.map((name, i) => {
        const state = lit[name];
        const fill = state === "hot" ? "#FF8C00" : state === "warm" ? "#C96F00" : "#222222";
        const textFill = state ? "#0F0F0F" : "rgba(255,255,255,0.55)";
        const mid = i * 45 + 22.5;
        const left = mid > 180;
        const [tx, ty] = polar(R * 0.64, mid);
        const rotate = left ? mid + 90 : mid - 90;
        return (
          <g key={name}>
            <path d={slicePath(i)} fill={fill} />
            <text
              x={tx}
              y={ty}
              fill={textFill}
              fontSize="15"
              fontWeight="700"
              textAnchor="middle"
              dominantBaseline="central"
              transform={`rotate(${rotate} ${tx} ${ty})`}
              style={{ fontFamily: "var(--font-ui)" }}
            >
              {name}
            </text>
          </g>
        );
      })}
      <circle cx={C} cy={C} r={HOLE + 4} fill="#0F0F0F" />
      <g transform={`translate(${C - 12} ${C - 12}) scale(0.375)`}>
        <path d="M37.6376 46.8389C38.3115 46.4736 39.761 45.0346 40.3087 44.4661C43.6667 40.9669 45.7172 36.3683 46.1015 31.476C46.5527 25.2889 44.3397 20.185 39.276 16.6843C36.6783 14.8884 33.2664 13.6075 33.8447 9.76024C33.9631 8.97291 34.3729 2.37499 34.7308 2.06169C35.9208 1.75006 40.7951 3.0384 42.1058 3.51419C52.6194 6.95172 60.5208 17.0022 61.7925 28.2C62.7059 35.9892 60.5806 43.8325 55.879 50.0232C50.7164 56.6849 43.8213 60.7754 35.5314 61.7806C27.5679 62.7462 19.5618 60.5109 13.294 55.3496C7.19843 50.33 3.03859 43.0481 2.18919 35.0335C1.30952 27.2333 3.52129 19.3976 8.3285 13.2837C12.36 8.14291 17.9052 4.47581 24.1367 2.82942C25.7968 2.39692 27.1568 2.20669 28.8381 2.02126C29.0272 1.99472 29.024 1.98744 29.2049 2.03244C29.3735 2.16468 29.4525 2.38864 29.4712 2.60332C29.6729 4.91607 29.9398 7.22149 30.1245 9.53633C30.1758 10.1789 30.2166 10.822 30.1055 11.4603C29.6034 14.3484 26.6759 15.2448 24.6377 16.7792C23.1113 17.9284 21.7898 19.1253 20.6851 20.7219C18.0802 24.487 17.4378 28.9454 18.2014 33.4318C19.0855 38.8462 22.027 43.6803 26.3816 46.876C26.4522 46.1339 26.436 45.1535 26.4667 44.3734L26.7043 38.6526C26.7364 37.9576 26.7427 37.0738 26.8294 36.3864C26.842 36.287 26.9157 36.0962 27.0342 36.0586C27.4077 35.9402 27.9802 35.9412 28.3612 36.0287C28.4834 36.0567 28.6714 36.1652 28.6876 36.2603C28.7677 36.7322 28.7226 37.7298 28.7471 38.1427C28.8187 39.3509 29.044 48.0034 29.2199 48.3388C29.5168 48.5257 30.24 48.629 30.6137 48.6994L30.8763 39.9651C30.9052 39.1516 30.9117 36.9582 31.02 36.2879C31.2423 36.0044 32.5855 36.051 32.9225 36.1885C33.0209 36.2285 33.0752 36.4078 33.0798 36.512C33.1253 37.5504 33.1174 38.5913 33.1425 39.6316L33.2813 45.4817C33.3063 46.5801 33.2961 47.6623 33.3537 48.7612C33.9371 48.6565 34.262 48.5852 34.8199 48.3806C35.0403 44.4495 35.1049 40.4788 35.3016 36.5439C35.3142 36.2951 35.3922 35.994 35.6985 36.0058C36.0758 36.0206 36.7562 35.8498 37.0556 36.0953C37.283 36.6281 37.4046 41.4245 37.4376 42.3145L37.6376 46.8389Z" fill="#FF8C00" />
      </g>
    </svg>
  );
}
