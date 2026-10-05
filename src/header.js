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
