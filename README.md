# library-reader Chromium Extension

This browser extension adds a simple reader mode, using [Mozilla's readability library](https://github.com/mozilla/readability).

* Left clicking the icon toggles Reader Mode.
* Right clicking the icon gives the option to always run on the current domain.

## To Build

```bash
cd library-reader
node build.js
zip -r library-reader.zip manifest.json styles.css dist icons
```
