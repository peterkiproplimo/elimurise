import React from "react";

// Constants for maintainability
const GRADIENT_COLORS = [
  { r: 48, g: 24, b: 71 }, // Deep Blue
  { r: 125, g: 130, b: 185 }, // Bluebonnet
  { r: 94, g: 104, b: 191 }, // Ultramarine Blue
  { r: 139, g: 92, b: 181 }, // Medium Slate Blue
  { r: 112, g: 72, b: 145 }, // Maximum Blue Purple
];

const TEXT_COLOR = "#FFFFFF"; // White
const APPROVAL_TEXT = "Approved By K.I.C.D";
const FONT_FAMILY = "'Inter', Arial, sans-serif"; // Premium font (ensure loaded)
const SVG_WIDTH = 200;
const SVG_HEIGHT = 300;

const generateGradientColors = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }

  const gradientIndex = Math.abs(hash % GRADIENT_COLORS.length);
  const selectedColor = GRADIENT_COLORS[gradientIndex];
  const nextIndex = (gradientIndex + 1) % GRADIENT_COLORS.length;
  const nextColor = GRADIENT_COLORS[nextIndex];

  const gradientStart = `rgb(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`;
  const gradientEnd = `rgb(${nextColor.r}, ${nextColor.g}, ${nextColor.b})`;

  return { gradientStart, gradientEnd };
};

interface BookCoverProps {
  bookName: string;
  author: string;
  width?: string; // Optional prop for custom width
  height?: string; // Optional prop for custom height
}

const BookCover: React.FC<BookCoverProps> = ({
  bookName,
  author,
  width = "100%",
  height = "100%",
}) => {
  const { gradientStart, gradientEnd } = generateGradientColors(bookName);

  return (
    <div
      className="flex justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-3xl"
      style={{ width, height }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background with subtle texture */}
        <defs>
          <linearGradient id="coverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: gradientStart, stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: gradientEnd, stopOpacity: 1 }}
            />
          </linearGradient>
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix type="saturate" values="0" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>
        </defs>

        {/* Main Background */}
        <rect
          x="0"
          y="0"
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          fill="url(#coverGradient)"
          filter="url(#noiseFilter)"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
          rx="10"
        />

        {/* Decorative Elements */}
        <circle
          cx="40"
          cy="40"
          r="50"
          fill={gradientEnd}
          opacity="0.2"
          filter="blur(10px)"
        />
        <circle
          cx="160"
          cy="60"
          r="40"
          fill={gradientStart}
          opacity="0.2"
          filter="blur(10px)"
        />
        <path
          d="M 0 300 Q 100 250 200 300"
          fill={gradientEnd}
          opacity="0.3"
          filter="blur(5px)"
        />

        {/* Text */}
        <g textAnchor="middle">
          <text
            x="50%"
            y="35%"
            fill={TEXT_COLOR}
            fontSize="24"
            fontFamily={FONT_FAMILY}
            fontWeight="700"
            letterSpacing="1.5"
            textLength={bookName.length > 15 ? "160" : undefined}
            lengthAdjust={bookName.length > 15 ? "spacingAndGlyphs" : undefined}
          >
            {bookName.split(" ").map((word, index) => (
              <tspan key={index} x="50%" dy={index === 0 ? "0" : "30"}>
                {word}
              </tspan>
            ))}
          </text>
          <text
            x="50%"
            y="70%"
            fill={TEXT_COLOR}
            fontSize="16"
            fontFamily={FONT_FAMILY}
            fontStyle="italic"
            opacity="0.9"
          >
            {author}
          </text>
        </g>

        {/* Bottom Banner */}
        <rect
          x="0"
          y={SVG_HEIGHT - 50}
          width={SVG_WIDTH}
          height="50"
          fill={gradientEnd}
          opacity="0.9"
        />
        <text
          x="50%"
          y={SVG_HEIGHT - 25}
          fill={TEXT_COLOR}
          fontSize="12"
          fontFamily={FONT_FAMILY}
          fontWeight="500"
          textAnchor="middle"
          opacity="0.85"
        >
          {APPROVAL_TEXT}
        </text>

        {/* Subtle Overlay */}
        <rect
          x="0"
          y="0"
          width={SVG_WIDTH}
          height={SVG_HEIGHT}
          fill="rgba(0, 0, 0, 0.05)"
          rx="10"
        />
      </svg>
    </div>
  );
};

export default BookCover;
