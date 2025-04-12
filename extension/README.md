# Console Whisperer Extension

This directory contains the browser extension part of Console Whisperer.

## Structure

- `manifest.json`: Extension manifest file
- `assets/`: Static assets (icons, images)
- `background/`: Background scripts
- `content/`: Content scripts
- `popup/`: Popup UI
- `styles/`: Shared styles
- `utils/`: Utility functions

## Development

1. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top-right corner
   - Click "Load unpacked" and select this directory

2. Make your changes and reload the extension to see them

## Testing

To test the extension, you can use the test page in `docs/test.html`. This page contains buttons that generate various JavaScript errors to test the extension's functionality.

## Building

To build the extension for distribution, run:

```
npm run build:extension
```

This will create a zip file in the `dist` directory.
