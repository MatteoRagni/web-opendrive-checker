# ASAM OpenDRIVE Web Checker

The **ASAM OpenDRIVE Web Checker** is a fully client-side web application designed to validate and analyze `.xodr` (OpenDRIVE) files.

The standout feature of this project is the **local execution model**: all OpenDRIVE analysis and validation occurs entirely within your web browser using WebAssembly and Pyodide. **No data is ever uploaded or sent to a remote server.**

## Architecture & Rationale

This project wraps the official python-based `ASAM qc-opendrive` checker inside a Vue 3 Single Page Application (SPA). By leveraging [Pyodide](https://pyodide.org/), it spins up a full Python environment directly in the browser's ecosystem as a Web Worker.

### Why local wheel files?

Currently, the dependencies required to run the `qc-opendrive` tools are packaged as `.whl` files and stored directly in the repository. This is a temporary measure while we wait for the upstream PR to be merged: 
[asam-ev/qc-opendrive#133](https://github.com/asam-ev/qc-opendrive/pull/133)

Once that PR is merged, we will transition to downloading the dependencies dynamically from standard Python package index (PyPI).

## Self-Hosting & Installation

Because all parsing and logic logic is client-side, hosting this application is incredibly lightweight. Any standard static file server can serve the dist folder.

### Local Development

1. Clone the repository
2. Install NodeJS dependencies:
   ```bash
   npm install
   ```
3. Start the local Vite development server:
   ```bash
   npm run dev
   ```

### Production Build & Hosting

1. Build the production distributable:
   ```bash
   npm run build
   ```
2. The generated `dist/` directory contains everything you need. You can copy these files manually to your web server (e.g., Nginx, Apache), S3 bucket, or GitHub Pages.

## License

This project is licensed under **Apache License 2.0**. See the internal interface for details on third-party licenses (Vue, Pyodide, Bootstrap).
