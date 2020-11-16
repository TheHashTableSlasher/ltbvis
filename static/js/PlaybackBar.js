let PlaybackBar = L.Control.extend({
    options: {
        position: "bottomleft"
    },

    initialize: function(map, workspace, options) {
        this.map = map;
        this.workspace = workspace;
        this.playbackbar = null;

        if (options) L.Util.setOptions(this, options);
    },

    onAdd: function(options) {
        const { map, workspace } = this;

        let div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.style.backgroundColor = "white";
        div.style.boxSizing = "border-box";
        div.style.padding = "4px";

        L.DomEvent.disableClickPropagation(div);

        let playbackbar = L.DomUtil.create('input', '', div);
        this.playbackbar = playbackbar;
        playbackbar.style.width = "100%";
        playbackbar.type = "range";
        playbackbar.min = 0;
        playbackbar.max = map.end_time;
        playbackbar.step = 0.01;
        playbackbar.value = map.end_time;

        playbackbar.oninput = function() {
            workspace.currentTimeInSeconds = Number(playbackbar.value);
        }

        let ldiv = L.DomUtil.create('div', '', div);
        ldiv.style.float = "left";

        let pausebutton = L.DomUtil.create('input', '', ldiv);
        pausebutton.type = "button";
        pausebutton.value = "Pause";

        pausebutton.onclick = function() { console.log(name + ": Pause!"); }

        let stopbutton = L.DomUtil.create('input', '', ldiv);
        stopbutton.type = "button";
        stopbutton.value = "Stop";

        stopbutton.onclick = function() {
            map.resetTime();
        }

        let rdiv = L.DomUtil.create('div', '', div);
        rdiv.style.float = "right";

        let playbackspeedrange = L.DomUtil.create('input', '', rdiv);
        playbackspeedrange.type = "range";
        playbackspeedrange.value = 2;
        playbackspeedrange.min = -1;
        playbackspeedrange.max = 6;
        playbackspeedrange.step = 1;

        let playbackspeedspan = L.DomUtil.create('span', '', rdiv);
        playbackspeedspan.innerHTML = " 1x ";

        let playbackspeedtext = L.DomUtil.create('input', '', rdiv);
        playbackspeedtext.type = "text";
        playbackspeedtext.value = "1";
        playbackspeedtext.pattern = "[0-9]*(\.[0-9]*)?";
        playbackspeedtext.disabled = true;
        playbackspeedtext.size = 4;

        playbackspeedrange.oninput = function() {
            if (playbackspeedrange.value < 0) {
                playbackspeedtext.disabled = false;
                playbackspeedspan.innerHTML = " Custom ";

                const val = Number(playbackspeedtext.value);

                if (val >= 0) {
                    map.timescale = val;
                }
            } else {
                playbackspeedtext.disabled = true;

                const vals = [
                    0.25,
                    0.5,
                    1,
                    1.5,
                    2,
                    3,
                    4
                ];

                const val = vals[Number(playbackspeedrange.value)];

                map.timescale = val;
                playbackspeedspan.innerHTML = " " + val + "x ";
            }
        }

        playbackspeedtext.oninput = function() {
            const val = Number(playbackspeedtext.value);

            if (val > 0) {
                map.timescale = val;
            }
        }

        return div;
    },

    onRemove: function(options) {},

    updatePlaybackBar: function(value) {
        if (this.playbackbar) {
            this.playbackbar.value = value;
        }
    }
});
