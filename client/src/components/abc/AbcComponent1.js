import React, { useEffect, useState, useRef } from 'react';
import abcjs from 'abcjs';

// this is from https://codesandbox.io/s/ey8r3?file=/src/AbcComponent.js
export default function AbcComponent1({ abc }) {
  const [abcTune, setAbcTune] = useState(abc);
  const inputEl = useRef(null);

  useEffect(() => {
    // renderAbc or renderMidi
    inputEl &&
      abcjs.renderAbc(inputEl.current, abcTune, {
        add_classes: true,
        responsive: 'resize',
        generateDownload: true,
      });
  }, [abcTune]);

  useEffect(() => {
    setAbcTune(abc);
  }, [abc]);

  return (
    <div>
      <div ref={inputEl}></div>
    </div>
  );
}
