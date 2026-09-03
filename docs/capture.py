#!/usr/bin/env python3
"""Regenerate docs/screenshots/*.jpg + docs/walkthrough.mp4 from the running app.

Prerequisites (see ../README.md):
  * backend running on http://localhost:8000  (uvicorn app.main:app)
  * frontend running on http://localhost:5173 (npm run dev)
  * database seeded                            (python -m app.seed)
  * Node.js on PATH, and Chrome or Edge installed

This installs two npm packages (puppeteer-core, ffmpeg-static) into docs/ on the
first run, then hands off to _capture.js. Override the admin credentials or app
URL with the ADMIN_USER / ADMIN_PASS / APP_URL environment variables.
"""
import os
import shutil
import subprocess
import sys

DOCS = os.path.dirname(os.path.abspath(__file__))
DEPS = ("puppeteer-core", "ffmpeg-static")


def run(cmd, **kw):
    print("+", " ".join(cmd))
    subprocess.check_call(cmd, cwd=DOCS, **kw)


def main():
    npm = shutil.which("npm")
    node = shutil.which("node")
    if not npm or not node:
        sys.exit("Node.js + npm are required and were not found on PATH.")

    if not os.path.isdir(os.path.join(DOCS, "node_modules", "puppeteer-core")):
        run([npm, "install", "--no-save", *DEPS])

    run([node, "_capture.js"])


if __name__ == "__main__":
    main()
