# library-reader Chromium Extension

This browser extension adds a simple reader mode, using [Mozilla's readability library](https://github.com/mozilla/readability).

Left clicking the icon toggles Reader Mode.
<img width="1181" height="808" alt="How to toggle reader mode" src="https://github.com/user-attachments/assets/af823116-e9ed-4168-ab6c-d14a291b9b7f" />

Right clicking the icon gives the option to always run on the current domain.
<img width="545" height="398" alt="How to always run on the current domain" src="https://github.com/user-attachments/assets/b1cdf401-2d06-42b2-8283-f877a752a615" />

## To Build

```bash
cd library-reader
node build.js
zip -r library-reader.zip manifest.json styles.css dist icons
```
