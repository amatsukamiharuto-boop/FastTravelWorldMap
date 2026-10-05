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
