var scene;
var camera;
var renderer;
var cube;
//debugger;


var defextent = {
    width: 1,
    height: 1
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
var geom = generateCoast(geopara);
var geomtri = Delaunay.triangulate(geom.mesh.vxs);
var geotris = createGroupedArray(geomtri, 3);
console.log(geotris);

//debugger;


function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 3;
    // debugger;
    var hlight = new THREE.HemisphereLight( 0xB58D3C, 0x080820, 1
);
    hlight.position.y = 3;
    scene.add( hlight );
    var light = new THREE.AmbientLight(0x404040, 0); // soft white light
    scene.add(light);
    var geometry = new THREE.Geometry();
    var gvxs = geom.mesh.vxs;
    for (var i = 0; i < geom.length; i++) {
        var h = geom[i];
        //h = Math.max(Math.min(h, 0.1), -0.1);
        //console.log(h);
        geometry.vertices.push(new THREE.Vector3(gvxs[i][0], gvxs[i][1], h));
    }
    for (var j = 0; j < geotris.length; j++) {
        var t = geotris[j];
        geometry.faces.push(new THREE.Face3(t[0], t[1], t[2]));
    }

    var material = new THREE.MeshPhongMaterial({color: 0xdddddd, specular: 0x009900, shininess: 30, shading: THREE.FlatShading
    });
    //renderer.setClearColorHex(0x333F47, 1);
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor( 0x000000 );
    cube.rotation.x = 90;
    render();
}
init();
function render() {
    //debugger;
    requestAnimationFrame(render);


     cube.rotation.z += 0.001;
     cube.rotation.y += 0.00001;

    renderer.render(scene, camera);
}
