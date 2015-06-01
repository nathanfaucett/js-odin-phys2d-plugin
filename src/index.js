var odin = require("odin"),
    phys2d = require("phys2d");


var Plugin = odin.Plugin,
    PluginPrototype = Plugin.prototype,
    Space = phys2d.Space,
    Phys2DPluginPrototype;


module.exports = Phys2DPlugin;


function Phys2DPlugin() {
    var _this = this;

    Plugin.call(this);

    this.space = new Space();

    this.update = Phys2DPlugin_createUpdate(this);
    this.onAddPhys2DRigidBody = function onAddPhys2DRigidBody(component) {
        _this.space.add(component.body);
    };
    this.onRemovePhys2DRigidBody = function onRemovePhys2DRigidBody(component) {
        _this.space.remove(component.body);
    };
}
Plugin.extend(Phys2DPlugin, "Phys2DPlugin");
Phys2DPluginPrototype = Phys2DPlugin.prototype;

Phys2DPluginPrototype.clear = function clear(emitEvent) {
    var scene = this.scene;

    PluginPrototype.clear.call(this, emitEvent);

    this.space.clear();

    scene.off("addPhys2DRigidBody", this.onAddPhys2DRigidBody);
    scene.off("removePhys2DRigidBody", this.onRemovePhys2DRigidBody);

    return this;
};

Phys2DPluginPrototype.init = function init() {
    var scene = this.scene;

    PluginPrototype.init.call(this);

    scene.on("addPhys2DRigidBody", this.onAddPhys2DRigidBody);
    scene.on("removePhys2DRigidBody", this.onRemovePhys2DRigidBody);

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
            space.step(step);
            accumulator -= step;
        }

        return _this;
    };
}
