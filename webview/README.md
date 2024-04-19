# Webview

This directory contains all of the code that will be executed within the webview context. It can be thought of as the place where all the "frontend" code of a webview is contained.

## Repository Structure
```
.
├── public          # The public folder contains static assets
├── scripts         # Script files used to launch React app
├── src             # React source files
│   └── components  # Folder containing React components
│   └── model       # Folder containing models
|   └── utils       # Folder containing utility functions
├── App.tsx         # Main React component, contains the webview UI
├── index.tsx       # Entry point for React app
└── ...

```

## Getting Started
Run this command to install the dependency:

```bash
npm install
```

Run this command to build the static files for Visual Studio Extension:

```bash
npm run build
```

All the static output files in `build/static/` folder.

