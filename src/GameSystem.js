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
