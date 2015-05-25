var odin = require("odin"),
    phys2d = require("phys2d");


var Plugin = odin.Plugin,
    PluginPrototype = Plugin.prototype,
    Space = phys2d.Space,
    Phys2DPluginPrototype;


module.exports = Phys2DPlugin;


function Phys2DPlugin() {

    Plugin.call(this);

    this.space = new Space();
    this.update = Phys2DPlugin_createUpdate(this);
}
Plugin.extend(Phys2DPlugin, "Phys2DPlugin");
Phys2DPluginPrototype = Phys2DPlugin.prototype;

Phys2DPluginPrototype.clear = function clear(emitEvent) {

    PluginPrototype.clear.call(this, emitEvent);

    this.space.clear();

    return this;
};

Phys2DPluginPrototype.init = function init() {

    PluginPrototype.init.call(this);

    return this;
};

Phys2DPluginPrototype.awake = function awake() {

    PluginPrototype.awake.call(this);

    return this;
};

function Phys2DPlugin_createUpdate(_this) {
    var accumulator = 0.0;

    return function update() {
        var space = _this.space,
            time = _this.scene.time,
            step = time.fixedDelta,
            delta = time.delta;

        PluginPrototype.update.call(_this);

        accumulator += delta;

        while (accumulator >= step) {
            space.update(step);
            accumulator -= step;
        }

        return _this;
    };
}
