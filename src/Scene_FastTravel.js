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
