# library-reader Chromium Extension

<a href="https://chromewebstore.google.com/detail/Library%20Reader/mjpdekbomfibfifomicibenpofdkkacc"><img src="https://img.shields.io/badge/INSTALL%20THE%20LIBRARY%20READER%20EXTENSION-8A2BE2" alt="Install the Library Reader Extension"></a> <img src="https://img.shields.io/chrome-web-store/size/mjpdekbomfibfifomicibenpofdkkacc" alt="Dynamic extension size">

This is the source for a browser extension that adds a simple reader mode, using [Mozilla's readability library](https://github.com/mozilla/readability).

## Example of a CNN Article

Left click the extension icon to toggle Reader Mode. `Ctrl+Space` will also toggle.

| Before | After |
| ------------- | ------------- |
| <img width="640" height="400" alt="Before reader mode activated" src="assets/images/reader-2.png" /> | <img width="640" height="400" alt="After reader mode activated" src="assets/images/reader-4.png" /> |

## Right Click the Extension Icon for Options

* `Always on for this domain`: toggles automatic activation of reader mode during any visit to the current domain.
* `Font`: choose `Sans Serif` (default), `Serif`, or `OpenDyslexic` for a font [designed for dyslexic readers](https://opendyslexic.org/). 
* `Theme`: choose `Dark` (default), `Light`, or `Color Blind Safe`

<img width="1280" height="800" alt="After reader mode activated" src="assets/images/reader-1.png" />

## Developers: Build and Package for Upload

```bash
cd library-reader
npm run package
```

## Privacy Policy

This extension needs read permission to every page, so it can create the reader view. **It does not collect any user data.**
