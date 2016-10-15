var scene;
var camera;
var renderer;
var cube;
var water;
//debugger;
var timet;

var defextent = {
    width: 1,
    height: 1
};

function generateUneroded() {
    var mesh = generateGoodMesh(12000);
    var h = add(slope(mesh, randomVector(1)),
                cone(mesh, 0.6),
                mountains(mesh, 5));
    h = peaky(h);
    h = fillSinks(h);
    h = setSeaLevel(h, 0.5);
    return h;
}

// Converts from degrees to radians.
Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};

var createGroupedArray = function(arr, chunkSize) {
    var groups = [],
        i;
    for (i = 0; i < arr.length; i += chunkSize) {
        groups.push(arr.slice(i, i + chunkSize));
    }
    return groups;
};
var geopara = {
    npts: 16000,
    extent: defextent
};
var geom = generateUneroded();
geom = doErosion(geom, 0.01);
console.log(geom.mesh.vxs);
var geomtri = Delaunay.triangulate(geom.mesh.vxs);
var geotris = createGroupedArray(geomtri, 3);
console.log(geotris);
var text2 = document.createElement('div');
text2.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
text2.style.width = 100;
text2.style.height = 100;

//debugger;


function init() {
    timet = 0;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 1;
    camera.position.y = 1;
    camera.rotation.x = Math.radians(-45);
    // debugger;
    var hlight = new THREE.HemisphereLight(0xB58D3C, 0x080820, 1);
    hlight.position.y = 4;
    scene.add(hlight);
    var light = new THREE.AmbientLight(0x404040, 0.1); // soft white light
    scene.add(light);
    var geometry = new THREE.Geometry();
    var gvxs = geom.mesh.vxs;
    for (var i = 0; i < geom.length; i++) {
        var h = geom[i];
        //h = Math.max(Math.min(h, 0.1), -0.1);
        //console.log(h);
        geometry.vertices.push(new THREE.Vector3(gvxs[i][0] - 0.5, gvxs[i][1] - 0.5, h));
    }
    for (var j = 0; j < geotris.length; j++) {
        var t = geotris[j];
        geometry.faces.push(new THREE.Face3(t[0], t[1], t[2]));
    }
    var pgeo = new THREE.PlaneBufferGeometry(1, 1);
    var material = new THREE.MeshPhongMaterial({
        color: 0xdddddd,
        shading: THREE.FlatShading,
        //side: THREE.DoubleSide,
        shininess: 0,
        specular: 0x000000
    });
    var watermaterial = new THREE.MeshPhongMaterial({
        color: 0x13436b,
        shading: THREE.FlatShading,
        shininess: 0,
        side: THREE.DoubleSide,
        specular: 0x000000,
        transparent: true,
        opacity: 0.95
    });
    //renderer.setClearColorHex(0x333F47, 1);
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    water = new THREE.Mesh(pgeo, watermaterial);
    scene.add(water);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0xff0000);
    cube.rotation.x = Math.radians(90);
    water.rotation.x = Math.radians(90);
    //water.rotation.x = -130;
    //water.position.y = 0.1;
    render();
}
init();

function render() {
    text2.innerHTML = Math.degrees(cube.rotation.z);
    text2.style.top = 200 + 'px';
    text2.style.left = 200 + 'px';
    document.body.appendChild(text2);
    //debugger;
    requestAnimationFrame(render);
    //water.position.y = (Math.sin(timet)*2);
    //timet += 0.5;
    //camera.rotation.x -= 0.001*Math.PI;
    //water.rotation.z += 0.001;
    cube.rotation.z += 0.001;
    water.rotation.z += 0.001

    renderer.render(scene, camera);
}
