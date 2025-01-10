var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var anchor = new BABYLON.AbstractMesh("anchor", scene);

    scene.createDefaultCameraOrLight(true, true, true);
    scene.cameras[0].target = new BABYLON.Vector3(1.5, 1, 0);
    scene.cameras[0].position = new BABYLON.Vector3(1.5, 1, -7);
    scene.cameras[0].radius = 7;


    var box = BABYLON.MeshBuilder.CreateSphere("box", {diameter: 4}, scene);
    box.enablePointerMoveEvents = true;


    var mesh = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
    mesh.material = new BABYLON.StandardMaterial("", scene);
    mesh.material.emissiveColor = BABYLON.Color3.Green();
    mesh.material.diffuseColor = BABYLON.Color3.Black();

    var behavior = new BABYLON.SurfaceMagnetismBehavior();
    behavior.attach(mesh);
    behavior.meshes = [box]
    behavior.maxStickingDistance = 99999
    behavior.hitNormalOffset = 0
    behavior.keepOrientationVertical = false
    behavior.lerpTime = 0

    return scene;

}