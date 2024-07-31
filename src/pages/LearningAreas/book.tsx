import React from "react";

const generateGradientColors = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }

  // Generate colors ranging from green to blue
  const greenValue = Math.max(0, Math.min(255, (hash & 0x00ff00) >> 8));
  const blueValue = Math.max(0, Math.min(255, hash & 0x0000ff));

  const gradientStart = `rgb(34, ${greenValue}, 50)`; // Light green
  const gradientEnd = `rgb(30, 60, ${blueValue})`; // Dark blue

  return { gradientStart, gradientEnd };
};

interface BookCoverProps {
  bookName: string;
  author: string;
}

const BookCover: React.FC<BookCoverProps> = ({ bookName, author }) => {
  const { gradientStart, gradientEnd } = generateGradientColors(bookName);
  const textColor = "#FFFFFF"; // White

  return (
    <div className="w-full h-full flex justify-center items-center bg-gradient-to-b rounded-lg shadow-2xl overflow-hidden">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 300"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background and border */}
        <rect
          x="0"
          y="0"
          width="200"
          height="300"
          fill="url(#coverGradient)"
          stroke="#333"
          strokeWidth="4"
          rx="10"
        />

        {/* Gradient Background */}
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
        </defs>

        {/* Decorative Elements */}
        <circle cx="50" cy="50" r="50" fill={gradientEnd} opacity="0.3" />
        <circle cx="150" cy="80" r="40" fill={gradientStart} opacity="0.3" />

        {/* Text */}
        <g id="text" textAnchor="middle">
          <text
            x="50%"
            y="40%"
            fill={textColor}
            fontSize="20"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
            letterSpacing="2"
          >
            {bookName.split(" ").map((word, index) => (
              <tspan key={index} x="50%" dy={index === 0 ? "0" : "25"}>
                {word}
              </tspan>
            ))}
          </text>
          <text
            x="50%"
            y="70%"
            fill={textColor}
            fontSize="16"
            fontFamily="Arial, sans-serif"
            fontStyle="italic"
          >
            {author}
          </text>
        </g>

        {/* Bottom Banner */}
        <rect x="0" y="250" width="200" height="50" fill={gradientEnd} />
        <text
          x="50%"
          y="275"
          fill="#FFFFFF"
          fontSize="12"
          fontFamily="Arial, sans-serif"
          textAnchor="middle"
        >
          Approved By K.I.C.D
        </text>
      </svg>
    </div>
  );
};

export default BookCover;
