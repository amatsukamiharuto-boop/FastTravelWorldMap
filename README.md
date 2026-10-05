# FastTravelWorldMap

Fast travel screen with a world map for RPG Maker MZ.

## Using the plugin

Copy `dist/FastTravelWorldMap.js` into your project's `js/plugins/` folder and enable it in the Plugin Manager.

## Developing

The source lives in `src/`, one file per piece. `npm run build` joins them into `dist/FastTravelWorldMap.js`.

To build straight into a game project:

    node build.js "C:/path/to/Project/js/plugins"

The build prints which line range of the output belongs to which source file, so an error at `FastTravelWorldMap.js:210` can be traced back quickly. Syntax errors are caught during the build.

| File | Contents |
| --- | --- |
| `header.js` | Plugin parameters and command definitions |
| `params.js` | Parameter parsing and helpers |
| `GameSystem.js` | Unlock state stored in `$gameSystem` |
| `Window_FastTravelList.js` | Destination list |
| `Window_FastTravelMarkers.js` | Map markers and highlight |
| `Scene_FastTravel.js` | The travel screen |
| `commands.js` | Plugin commands |
