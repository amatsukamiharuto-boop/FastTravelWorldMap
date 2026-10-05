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
