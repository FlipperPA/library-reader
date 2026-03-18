# library-reader Chromium Extension

This browser extension adds a simple reader mode, using [Mozilla's readability library](https://github.com/mozilla/readability). Want to try the beta?

* [Download the latest beta release](https://github.com/FlipperPA/library-reader/releases/) and unzip it
* Open your extensions `chrome://extensions` or `helium://extensions`
* Toggle `Developer mode` to be on, if it is off
* Select `Load Unpacked` and point to the unzipped folder

## Before

<img width="1181" height="808" alt="Before reader mode activated" src="https://github.com/user-attachments/assets/556a8134-4c99-45ea-8c12-0371a7e2dcfb" />

## After

Left click the icon to toggle Reader Mode. `Ctrl+Space` will also toggle.

<img width="1181" height="808" alt="How to toggle reader mode" src="https://github.com/user-attachments/assets/af823116-e9ed-4168-ab6c-d14a291b9b7f" />

## Right Click for Options

* Always Run for the Current Domain: toggles automatic activation of reader mode during any visit to the current domain.
* Font: choose `Sans Serif` (default), `Serif`, or `OpenDyslexic` for a font [designed for dyslexic readers](https://opendyslexic.org/). 

## To Build

```bash
cd library-reader
node build.js
zip -r library-reader.zip manifest.json styles.css dist assets
```
