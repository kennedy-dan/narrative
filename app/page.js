"use client"
import React, { useState } from "react";
import axios from "axios";

const maslowLevels = [
  "Essentials for Living",
  "Security and Peace of Mind",
  "Belonging and Connection",
  "Well-being, Self-Respect and Achievement",
  "Living Your Potential",
];

const storyTypes = [
  "Against All Odds",
  "The Journey for Change",
  "Rising From the Ashes",
  "The Fall From Grace",
  "Comedy",
  "Our Hero Returns",
  "From Grass to Grace",
];

const culturalContexts = [
  "Youth Hustle Life",
  "Ethnicity",
  "Psychographics",
];

const enhancementOptions = [
  "Cinematic angles and moody lighting",
  "Facial emotion and grit",
  "Cultural artifacts",
  "Poster-worthy layout",
];

export default function DemoFlow() {
  const [maslow, setMaslow] = useState("");
  const [archetype, setArchetype] = useState("");
  const [context, setContext] = useState("");
  const [story, setStory] = useState("");
  const [visualCue, setVisualCue] = useState("");
  const [wantsVisual, setWantsVisual] = useState(null);
  const [selectedEnhancements, setSelectedEnhancements] = useState([]);
  const [visualOutput, setVisualOutput] = useState("");

  const generateStory = async () => {
    const res = await axios.post("/api/story", { maslow, archetype, context });
    setStory(res.data.story);
    setVisualCue(res.data.visualCue);
  };

  const generateVisual = async (type) => {
    const res = await axios.post("/api/visual", {
      visualCue,
      enhancements: selectedEnhancements,
      type,
    });
    setVisualOutput(res.data.output);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Narratives.XO Demo Flow</h1>

      <div>
        <label>Maslow Level</label>
        <select onChange={(e) => setMaslow(e.target.value)} value={maslow}>
          <option value="">Select</option>
          {maslowLevels.map((lvl) => (
            <option key={lvl}>{lvl}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Story Type</label>
        <select onChange={(e) => setArchetype(e.target.value)} value={archetype}>
          <option value="">Select</option>
          {storyTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label>Cultural Context</label>
        <select onChange={(e) => setContext(e.target.value)} value={context}>
          <option value="">Select</option>
          {culturalContexts.map((ctx) => (
            <option key={ctx}>{ctx}</option>
          ))}
        </select>
      </div>

      <button className="bg-blue-500 text-white p-2" onClick={generateStory}>
        Generate Story
      </button>

      {story && (
        <div>
          <h2 className="text-xl font-semibold">Generated Story</h2>
          <p>{story}</p>

          <div className="mt-4">
            <label>Would you like to create a visual or video script?</label>
            <div>
              <button onClick={() => setWantsVisual("image")}>Image</button>
              <button onClick={() => setWantsVisual("video")}>Video Script</button>
              <button onClick={() => setWantsVisual("skip")}>Skip</button>
            </div>
          </div>
        </div>
      )}

      {wantsVisual && wantsVisual !== "skip" && (
        <div className="mt-4">
          <label>Choose enhancements to guide generation:</label>
          {enhancementOptions.map((enh) => (
            <div key={enh}>
              <input
                type="checkbox"
                value={enh}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedEnhancements((prev) =>
                    prev.includes(val)
                      ? prev.filter((x) => x !== val)
                      : [...prev, val]
                  );
                }}
              />
              {enh}
            </div>
          ))}
          <button onClick={() => generateVisual(wantsVisual)}>Generate {wantsVisual}</button>
        </div>
      )}

      {visualOutput && (
        <div className="mt-6">
          <h3 className="text-lg font-medium">{wantsVisual === "image" ? "Image Prompt" : "Video Script"}</h3>
          <pre>{visualOutput}</pre>
        </div>
      )}
    </div>
  );
}
