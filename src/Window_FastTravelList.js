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
