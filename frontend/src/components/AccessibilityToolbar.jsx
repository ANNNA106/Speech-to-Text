// frontend/src/components/AccessibilityToolbar.jsx
import React from "react";

function AccessibilityToolbar({
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  mode,
  setMode,
  theme,
  setTheme,
}) {
  return (
    <div className="accessibility-toolbar">
      <div className="toolbar-group">
        <span>Text size:</span>
        <button onClick={() => setFontSize(Math.max(14, fontSize - 2))}>
          A-
        </button>
        <button onClick={() => setFontSize(Math.min(32, fontSize + 2))}>
          A+
        </button>
      </div>

      <div className="toolbar-group">
        <span>Line spacing:</span>
        <button onClick={() => setLineHeight(1.4)}>Normal</button>
        <button onClick={() => setLineHeight(1.8)}>Wide</button>
      </div>

      <div className="toolbar-group">
        <span>View:</span>
        <button onClick={() => setMode("both")}>Both</button>
        <button onClick={() => setMode("summary")}>Summary only</button>
        <button onClick={() => setMode("transcript")}>Transcript only</button>
      </div>

      <div className="toolbar-group">
        <span>Theme:</span>
        <button onClick={() => setTheme("light")}>Light</button>
        <button onClick={() => setTheme("dark")}>Dark</button>
        <button onClick={() => setTheme("high-contrast")}>High contrast</button>
      </div>
    </div>
  );
}

export default AccessibilityToolbar;
