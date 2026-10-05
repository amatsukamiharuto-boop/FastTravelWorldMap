/*:
 * @target MZ
 * @plugindesc Fast travel screen with a world map background and unlockable destinations.
 *
 * @param locations
 * @text Destinations
 * @type struct<Location>[]
 * @default []
 * @desc Every place the player can travel to.
 *
 * @param mapImage
 * @text World Map Image
 * @type file
 * @dir img/pictures/
 * @desc Picture shown behind the travel screen. It is stretched to fit the game screen.
 *
 * @param emptyText
 * @text Empty List Text
 * @type string
 * @default No destinations unlocked yet.
 * @desc Shown in the description box while nothing is unlocked.
 *
 * @command OpenMap
 * @text Open Map
 * @desc Opens the fast travel screen.
 *
 * @command UnlockLocation
 * @text Unlock Location
 * @desc Makes a destination available for travel.
 *
 * @arg id
 * @text Location ID
 * @type string
 * @desc The ID of the destination, as written in the plugin parameters.
 *
 * @command LockLocation
 * @text Lock Location
 * @desc Removes a destination from the travel list.
 *
 * @arg id
 * @text Location ID
 * @type string
 * @desc The ID of the destination, as written in the plugin parameters.
 *
 * @help FastTravelWorldMap.js
 *
 * Define destinations in the plugin parameters, then call the plugin
 * commands from events.
 *
 * Marker X / Y are optional. When both are 0 or higher, the destination
 * gets an icon at that screen position on top of the world map image,
 * and the selected one is highlighted. Leave them at -1 to list the
 * destination without a marker.
 *
 * Direction "Retain" keeps whatever way the player was facing.
 *
 * Unlock states are stored in the save file.
 */

/*~struct~Location:
 * @param id
 * @text ID
 * @type string
 * @desc Unique ID used by the plugin commands.
 *
 * @param name
 * @text Name
 * @type string
 *
 * @param mapId
 * @text Target Map ID
 * @type number
 * @min 1
 * @default 1
 *
 * @param x
 * @text X
 * @type number
 * @min 0
 * @default 0
 *
 * @param y
 * @text Y
 * @type number
 * @min 0
 * @default 0
 *
 * @param direction
 * @text Facing Direction
 * @type select
 * @option Retain
 * @value 0
 * @option Down
 * @value 2
 * @option Left
 * @value 4
 * @option Right
 * @value 6
 * @option Up
 * @value 8
 * @default 2
 *
 * @param icon
 * @text Icon Index
 * @type icon
 * @default 0
 *
 * @param description
 * @text Description
 * @type note
 *
 * @param unlocked
 * @text Default Unlocked
 * @type boolean
 * @default false
 *
 * @param markerX
 * @text Marker X
 * @type number
 * @min -1
 * @default -1
 * @desc Screen X of the marker on the world map. -1 hides the marker.
 *
 * @param markerY
 * @text Marker Y
 * @type number
 * @min -1
 * @default -1
 * @desc Screen Y of the marker on the world map. -1 hides the marker.
 */

(() => {
    const pluginName = "FastTravelWorldMap";
    const params = PluginManager.parameters(pluginName);

    const parseJson = (text, fallback) => {
        try {
            return JSON.parse(text);
        } catch (e) {
            return fallback;
        }
    };

    const mapImage = String(params.mapImage || "");
    const emptyText = String(params.emptyText || "");

    const locations = parseJson(params.locations, []).map(entry => {
        const data = parseJson(entry, {});
        return {
            id: String(data.id || "").trim(),
            name: String(data.name || ""),
            mapId: Number(data.mapId) || 1,
            x: Number(data.x) || 0,
            y: Number(data.y) || 0,
            direction: Number(data.direction || 2),
            iconIndex: Number(data.icon) || 0,
            description: String(parseJson(data.description, data.description || "")),
            unlocked: data.unlocked === "true",
            markerX: Number(data.markerX || -1),
            markerY: Number(data.markerY || -1)
        };
    });

    const unlockedLocations = () => {
        return locations.filter(location => $gameSystem.isFastTravelUnlocked(location.id));
    };

    const hasMarker = location => location.markerX >= 0 && location.markerY >= 0;

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._fastTravelStates = {};
    };

    Game_System.prototype.fastTravelStates = function() {
        // saves made before the plugin was installed won't have this yet
        if (!this._fastTravelStates) {
            this._fastTravelStates = {};
        }
        return this._fastTravelStates;
    };

    Game_System.prototype.isFastTravelUnlocked = function(id) {
        const states = this.fastTravelStates();
        if (Object.prototype.hasOwnProperty.call(states, id)) {
            return states[id];
        }
        const location = locations.find(item => item.id === id);
        return !!location && location.unlocked;
    };

    Game_System.prototype.setFastTravelUnlocked = function(id, unlocked) {
        this.fastTravelStates()[id] = !!unlocked;
    };

    class Window_FastTravelList extends Window_Command {
        makeCommandList() {
            for (const location of unlockedLocations()) {
                this.addCommand(location.name, "travel", true, location);
            }
        }

        currentLocation() {
            const item = this._list[this.index()];
            return item ? item.ext : null;
        }

        setLocationHandler(handler) {
            this._locationHandler = handler;
        }

        drawItem(index) {
            const location = this._list[index].ext;
            const rect = this.itemLineRect(index);
            const offset = ImageManager.iconWidth + 6;
            this.resetTextColor();
            this.drawIcon(location.iconIndex, rect.x, rect.y + 2);
            this.drawText(location.name, rect.x + offset, rect.y, rect.width - offset);
        }

        updateHelp() {
            const location = this.currentLocation();
            this._helpWindow.setText(location ? location.description : emptyText);
            if (this._locationHandler) {
                this._locationHandler(location);
            }
        }
    }

    class Window_FastTravelMarkers extends Window_Base {
        constructor(rect) {
            super(rect);
            this.opacity = 0;
            this._selected = null;
            this.refresh();
        }

        updatePadding() {
            this.padding = 0;
        }

        setSelected(location) {
            if (this._selected !== location) {
                this._selected = location;
                this.refresh();
            }
        }

        refresh() {
            this.contents.clear();
            const half = ImageManager.iconWidth / 2;
            for (const location of unlockedLocations()) {
                if (!hasMarker(location)) {
                    continue;
                }
                const selected = location === this._selected;
                if (selected) {
                    this.contents.drawCircle(location.markerX, location.markerY, half + 6, "rgba(255, 255, 255, 0.45)");
                }
                this.drawIcon(location.iconIndex, location.markerX - half, location.markerY - half);
                if (selected) {
                    this.resetTextColor();
                    this.drawText(location.name, location.markerX - 100, location.markerY + half + 4, 200, "center");
                }
            }
        }
    }

    class Scene_FastTravel extends Scene_MenuBase {
        create() {
            super.create();
            this.createMarkerWindow();
            this.createHelpWindow();
            this.createListWindow();
        }

        createBackground() {
            super.createBackground();
            if (!mapImage) {
                return;
            }
            const sprite = new Sprite(ImageManager.loadPicture(mapImage));
            sprite.move((Graphics.width - Graphics.boxWidth) / 2, (Graphics.height - Graphics.boxHeight) / 2);
            sprite.bitmap.addLoadListener(bitmap => {
                sprite.scale.set(Graphics.boxWidth / bitmap.width, Graphics.boxHeight / bitmap.height);
            });
            this.addChild(sprite);
        }

        helpWindowRect() {
            const height = this.calcWindowHeight(3, false);
            return new Rectangle(0, Graphics.boxHeight - height, Graphics.boxWidth, height);
        }

        listWindowRect() {
            const height = Graphics.boxHeight - this.helpWindowRect().height;
            return new Rectangle(0, 0, 300, height);
        }

        createMarkerWindow() {
            const rect = new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
            this._markerWindow = new Window_FastTravelMarkers(rect);
            this.addWindow(this._markerWindow);
        }

        createListWindow() {
            this._listWindow = new Window_FastTravelList(this.listWindowRect());
            this._listWindow.setHandler("travel", this.onTravel.bind(this));
            this._listWindow.setHandler("cancel", this.popScene.bind(this));
            this._listWindow.setLocationHandler(location => this._markerWindow.setSelected(location));
            this._listWindow.setHelpWindow(this._helpWindow);
            this.addWindow(this._listWindow);
        }

        onTravel() {
            const location = this._listWindow.currentLocation();
            $gamePlayer.reserveTransfer(location.mapId, location.x, location.y, location.direction, 0);
            this.popScene();
        }
    }

    const setLocationState = (id, unlocked) => {
        const key = String(id).trim();
        if (locations.some(location => location.id === key)) {
            $gameSystem.setFastTravelUnlocked(key, unlocked);
        }
    };

    PluginManager.registerCommand(pluginName, "OpenMap", () => {
        SceneManager.push(Scene_FastTravel);
    });

    PluginManager.registerCommand(pluginName, "UnlockLocation", args => {
        setLocationState(args.id, true);
    });

    PluginManager.registerCommand(pluginName, "LockLocation", args => {
        setLocationState(args.id, false);
    });
})();
