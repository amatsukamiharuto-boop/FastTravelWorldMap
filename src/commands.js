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
