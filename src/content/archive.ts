import type { ArchiveItem, ToolEntry } from "./types";

/**
 * Everything else. Descriptions match what the source actually shows; the
 * notebooks were read, not re-executed, so no accuracy numbers are quoted.
 */
export const archive: ArchiveItem[] = [
  {
    name: "Crowd Counting",
    year: "2025",
    category: "AI & ML",
    description:
      "Notebook that counts people in still images using a pretrained YOLOv8 detector and draws the detections.",
    stack: ["Python", "YOLOv8 (Ultralytics)", "OpenCV"],
    link: { label: "Source", href: "https://github.com/k4keshav-singh/Crowd-Counting" },
    visible: true,
  },
  {
    name: "Heart disease prediction",
    year: "2025",
    category: "AI & ML",
    description:
      "Logistic-regression classifier with grid-searched hyperparameters and ROC analysis on a small public tabular dataset. A learning exercise, not a clinical tool.",
    stack: ["Python", "scikit-learn", "pandas"],
    link: { label: "Source", href: "https://github.com/k4keshav-singh/heart-disease-prediction" },
    visible: true,
  },
  {
    name: "Cat vs dog recognition",
    year: "2025",
    category: "AI & ML",
    description: "A small convolutional network for binary image classification, built and evaluated in a notebook.",
    stack: ["Python", "TensorFlow / Keras", "OpenCV"],
    link: { label: "Source", href: "https://github.com/k4keshav-singh/Cat-vs-dog-recognition" },
    visible: true,
  },
  {
    name: "House price prediction",
    year: "2025",
    category: "AI & ML",
    description:
      "Team project: a regression network on the Boston Housing dataset, with early stopping and regularisation. My part was data preparation and feature work.",
    stack: ["Python", "TensorFlow / Keras", "scikit-learn"],
    link: { label: "Source", href: "https://github.com/k4keshav-singh/House-Price-Prediction-" },
    visible: true,
  },
  {
    name: "Trash2treasure",
    year: "2025",
    category: "Web",
    description:
      "Responsive website about waste management, with PHP form handlers for contact and pickup requests.",
    stack: ["HTML", "CSS", "JavaScript", "PHP"],
    link: { label: "Source", href: "https://github.com/k4keshav-singh/Trash2treasure" },
    visible: true,
  },
  {
    name: "Bookified",
    year: "—",
    category: "AI & ML",
    description:
      "Retrieval-augmented Q&A over PDFs (chunking, embeddings, vector search) with a voice interface.",
    stack: ["Python", "LLMs", "Embeddings"],
    note: "Source not public yet",
    visible: true,
  },
  {
    name: "LLM text automation tool",
    year: "—",
    category: "AI & ML",
    description: "A prompt-engineered pipeline for text generation and summarisation.",
    stack: ["Python", "LLMs"],
    note: "Source not public yet",
    visible: true,
  },
  {
    name: "Engineering tooling guide",
    year: "2026",
    category: "Tooling",
    description:
      "An internal team guide (not published) to AI coding-assistant skills, plugins and Python tooling, re-checked against how the public tools really behave. See the tooling section below.",
    stack: ["Claude Code", "pytest", "Ruff", "MkDocs"],
    link: { label: "Details", href: "/#tooling" },
    visible: true,
  },
];

export const visibleArchive = archive.filter((item) => item.visible);

/** Third-party tools covered in the guide. None of these tools are mine; the labels say what I did with each. */
export const tooling: ToolEntry[] = [
  { name: "Graphify", purpose: "Turns a codebase into a queryable knowledge graph for navigation and AI context.", contribution: "Documented" },
  { name: "Caveman skill", purpose: "A Claude Code skill that forces terse, compressed responses.", contribution: "Documented" },
  { name: "Code Documenter + MkDocs", purpose: "Generates code documentation and renders it as a navigable site.", contribution: "Documented" },
  { name: "Python testing patterns", purpose: "Test design with pytest and HTML reports via pytest-html.", contribution: "Documented" },
  { name: "Code review plugin", purpose: "Pull-request analysis that can post findings to GitHub.", contribution: "Documented" },
  {
    name: "Ruff",
    purpose: "Fast Python linter and formatter.",
    contribution: "Documented · integrated",
    detail: "Wired into an AI coding prototype as an automatic lint check on generated code.",
  },
];

export const sopCorrections = [
  "Skills are picked up from their description; they are not slash commands.",
  "There is no `claude skills install` command; skills go in ~/.claude/skills or come from a plugin marketplace.",
  "Plugins need a .claude-plugin/plugin.json manifest and install through the plugin marketplace commands.",
];
