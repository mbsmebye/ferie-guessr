/* src/components/PicturePin.tsx */
import React from "react";

interface PicturePinProps {
  image: string;
  color: string;
}

export const PicturePin = ({ image, color }: PicturePinProps) => {
  const pinWidth = 200;
  const pinHeight = 160;
  const stickHeight = 10;
  const borderWidth = 2;

  return (
    // 1. ANCHOR POINT
    // We make this 0x0 size. The map will center this 0x0 point exactly on the coordinate.
    <div
      style={{
        width: "0px",
        height: "0px",
        position: "relative", // Allows absolute positioning of children relative to this point
        display: "flex", // Prevents ghost line-height space
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 2. THE PIN VISUALS 
          We position absolute so it grows OUT of the 0x0 anchor.
      */}
      <div
        style={{
          position: "absolute",
          // 'bottom: 0' puts the bottom edge of this div exactly on the anchor point
          bottom: 0,
          // Center it horizontally
          left: 0,
          transform: "translateX(-50%)",

          // Now we just style the visual box
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))",

          // Ensure clicks pass through the invisible parts if needed
          pointerEvents: "none",
        }}
      >
        {/* THE HEAD */}
        <div
          style={{
            width: `${pinWidth}px`,
            height: `${pinHeight}px`,
            border: `${borderWidth}px solid ${color}`,
            background: "white",
            display: "flex",
            boxSizing: "border-box",
            pointerEvents: "auto", // Re-enable clicks on the head
          }}
        >
          <img
            src={image}
            alt="Location"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* THE STICK */}
        <div
          style={{
            width: `${borderWidth}px`,
            height: `${stickHeight}px`,
            background: color,
            marginTop: "-1px",
          }}
        />
      </div>
    </div>
  );
};
