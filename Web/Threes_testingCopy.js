var scene;
var camera;
var renderer;
var cube;
var water;
var locH, locV; // location of the circle
var circleColor = 255; // color of the circle
var uniforms;
//debugger;
var tsinceb = 50;
var outnum = 3;
var timet;
var aniid;
var bbyte;
var tsinces = 100;
var eledges;
var Ntri;
xxmap = function(n, start1, stop1, start2, stop2) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};
var inData;
var serial; // variable to hold an instance of the serialport library
var portName = 'COM3'; // fill in your serial port name here

var defextent = {
    width: 2,
    height: 2
};
var defpoints = 500;
var ggui = new dat.GUI({
    height: 5 * 32 - 1
});


function empty(elem) {
    while (elem.lastChild) elem.removeChild(elem.lastChild);
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

function Geo_Write(mesh, tria,wix) {
    var vmesh = mesh;
    var vwix = wix;
    var vxs = vmesh.mesh.vxs;
    var ext = vmesh.mesh.extent;
    var wgeo = new THREE.Geometry();
    for (var i = 0; 0 < vmesh.mesh.length; i++) {
        var vec = new THREE.Vector3(vxs[i][0] - (ext.width / 2), vxs[i][1] - (ext.height / 2), -vmesh[i]);
        wgeo.vertices.push(vec);
    }
    wgeo.vertices.push(new THREE.Vector3(0,0,2));
    wgeo.vertices.push(new THREE.Vector3(ext.width/2,0,2));
    wgeo.vertices.push(new THREE.Vector3(ext.width/2,ext.height/2,2));
    wgeo.vertices.push(new THREE.Vector3(0,ext.height/2,2));
    for (var j = 0;j<4;j++){
      var ds = ["N","W","E","S"];
      
    }



}

function meshtogeo() {
    debugger;
    var mesh = generateGoodMesh(defpoints, defextent);
    var vmesh = zero(mesh);
    var meshtri = Delaunay.triangulate(vmesh.mesh.vxs);
    var meshind = {
        N: [],
        W: [],
        E: [],
        S: [],
    };
    for (var i = 0; i < vmesh.mesh.length; i++) {
        var vert = vmesh.mesh.vxs[i];
        if (vert[1] <= 0) {
            meshind.N.push(i);
        }
        if (vert[0] <= 0) {
            meshind.W.push(i);
        }
        if (vert[0] >= vmesh.mesh.extent.width) {
            meshind.E.push(i);
        }
        if (vert[1] >= vmesh.mesh.extent.height) {
            meshind.S.push(i);
        }
    }

    for (var k = 0; k < 4; k++) {
        var ds = ["N", "W", "E", "S"];
        var dp = [[1,0],[4,0],[3,1],[4,3]];
        meshind.ds[k] = meshind.ds[k].sort(function(a, b) {
            return a.x - b.x;
        });
        meshind.ds[k].push(dp[k][0]);
        meshind.ds[k].push(dp[k][1]);
    }
        meshtri = createGroupedArray(meshtri, 3);
        var geo = GeoWrite(vmesh, meshtri,meshind);

    }






    var geomesh;
    //console.log(geom.mesh.vxs);
    //console.log(geotris);
    var text2 = document.createElement('div');
    text2.style.position = 'absolute';
    //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
    text2.style.width = 100;
    text2.style.height = 100;

    //debugger;
    var edge_index = [
        [],
        [],
        [],
        []
    ];
    var edge_points = [
        [],
        [],
        [],
        []
    ];

    function init() {
        meshtogeo();
        timet = 0;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.z = 2;
        camera.position.y = 1;
        camera.rotation.x = Math.radians(-45);
        // debugger;
        var hlight = new THREE.DirectionalLight(0xB58D3C, 1);
        hlight.position.y = 4;
        scene.add(hlight);
        var geometry = new THREE.Geometry();
        var gvxs = geom.mesh.vxs;
        var thext = geom.mesh.extent;

        for (var i = 0; i < geom.length; i++) {
            var h = -1 * geom[i];

            //h = Math.max(Math.min(h, 0.1), -0.1);
            //console.log(h);
            geometry.vertices.push(new THREE.Vector3(gvxs[i][0] - (thext.width / 2), gvxs[i][1] - (thext.width / 2), h));
            if (gvxs[i][0] <= 0) {
                edge_index[0].push(i);
            }
            if (gvxs[i][1] <= 0) {
                edge_index[1].push(i);
            }
            if (gvxs[i][1] >= thext.width) {
                edge_index[2].push(i);
            }
            if (gvxs[i][0] >= thext.height) {
                edge_index[3].push(i);
            }
        }
        for (var j = 0; j < geotris.length; j++) {
            var t = geotris[j];
            geometry.faces.push(new THREE.Face3(t[0], t[1], t[2]));
        }
        geometry.vertices.push(new THREE.Vector3(-1, 1, 2));
        geometry.vertices.push(new THREE.Vector3(-1, -1, 2));
        edge_index[0].push(geom.length);
        edge_index[0].push(geom.length + 1);
        console.log(geometry.vertices[geom.length + 1]);
        for (var v = 0; v < edge_index[0].length; v++) {
            var vert = geometry.vertices[edge_index[0][v]];
            edge_points[0].push({
                x: vert.y,
                y: vert.z,
                i: v
            });
        }
        edge_points[0].sort(function(a, b) {
            return a.x - b.x;
        });
        var sortedpoints = [];
        for (var s = 0; s < edge_points[0].length; s++) {
            var ll = edge_points[0][s];
            sortedpoints.push([ll.x, ll.y]);
        }
        sortedpoints = [].concat.apply([], sortedpoints);

        console.log(sortedpoints);
        Ntri = earcut(sortedpoints);
        Ntri = createGroupedArray(Ntri, 3);
        for (var c = 0; c < Ntri.length; c++) {
            var ftri = Ntri[c];
            var ta = edge_points[0];
            var tp1 = ta[ftri[0]].i;
            var tp2 = ta[ftri[1]].i;
            var tp3 = ta[ftri[2]].i;
            geometry.faces.push(new THREE.Face3(edge_index[0][tp1], edge_index[0][tp2], edge_index[0][tp3]));
        }
        console.log(edge_points[0]);
        var pgeo = new THREE.PlaneBufferGeometry(3, 3);

        /*var material = new THREE.MeshPhongMaterial({
            color: 0xdddddd,
            shading: THREE.FlatShading,
            //side: THREE.DoubleSide,
            shininess: 0,
            specular: 0x000000
        });*/
        var cv1, cv2, cv3, cv4, cv5, cv6;
        cv1 = new THREE.Color(0xb48669);
        cv2 = new THREE.Color(0xc9c77f);
        cv3 = new THREE.Color(0x5ab339);
        cv4 = new THREE.Color(0xfcef7e);
        cv5 = new THREE.Color(0x1580c2);
        cv6 = new THREE.Color(0x181d4a);



        var myuniforms = {
            "cv1": {
                type: "v3",
                value: new THREE.Vector3(cv1.r, cv1.g, cv1.b)
            },
            "cv2": {
                type: "v3",
                value: new THREE.Vector3(cv2.r, cv2.g, cv2.b)
            },
            "cv3": {
                type: "v3",
                value: new THREE.Vector3(cv3.r, cv3.g, cv3.b)
            },
            "cv4": {
                type: "v3",
                value: new THREE.Vector3(cv4.r, cv4.g, cv4.b)
            },
            "cv5": {
                type: "v3",
                value: new THREE.Vector3(cv5.r, cv5.g, cv5.b)
            },
            "cv6": {
                type: "v3",
                value: new THREE.Vector3(cv6.r, cv6.g, cv6.b)
            }
        };
        uniforms =
            THREE.UniformsUtils.merge([

                THREE.UniformsLib.ambient,
                THREE.UniformsLib.lights,
                myuniforms

            ]);
        material = new THREE.ShaderMaterial({
            vertexShader: $('#vertexshader').text(),
            fragmentShader: $('#fragmentshader').text(),
            shading: THREE.FlatShading,
            lights: true,
            uniforms: uniforms,
            side: THREE.DoubleSide
        });
        var watermaterial = new THREE.MeshPhongMaterial({
            color: 0x13436b,
            shading: THREE.FlatShading,
            shininess: 0,
            side: THREE.DoubleSide,
            specular: 0x000000,
            transparent: true,
            opacity: 0.8
        });
        //renderer.setClearColorHex(0x333F47, 1);
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        water = new THREE.Mesh(pgeo, watermaterial);
        scene.add(water);
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        renderer.setClearColor(0x9ae0fe);
        cube.rotation.x = Math.radians(90);
        water.rotation.x = Math.radians(90);
        //water.rotation.x = -130;
        //water.position.y = 0.1;
        window.scene = scene;
        window.THREE = THREE;
        eledges = edge_points;
        render();
    }
    init();

    function render() {
        text2.innerHTML = cube.rotation.z + ',' + circleColor + ',' + locH + ',' + locV + ',' + outnum + ',' + bbyte;
        text2.style.top = 60 + 'px';
        text2.style.left = 200 + 'px';
        document.body.appendChild(text2);
        tsinces++;
        //debugger;
        aniid = requestAnimationFrame(render);
        //timet += 0.5;
        //camera.rotation.x -= 0.001*Math.PI;
        //water.rotation.z += 0.001;
        var rot = Math.floor(locH || 1) * 0.1;
        cube.rotation.z += 0.02 * rot;
        water.rotation.z += 0.02 * rot;
        var floored = ((((Math.abs(cube.rotation.z / (Math.PI * 2))) % 1) * 256));
        outnum = Math.floor(floored, 0.0, 1.0, 0, 256);
        var heyo = locV || 1;
        //debugger;
        camera.rotation.x = heyo * Math.radians(-45);
        if (tsinces > 60) {
            serial.write(outnum); // send a byte requesting more serial data
            tsinces = 0;
        } else {
            tsinces++;
        }
        renderer.render(scene, camera);
    }

    function rerender() {

        camera.position.z = 1;
        camera.position.y = 1;
        camera.rotation.x = Math.radians(-45);
        // debugger;
        var geometry = null;
        geometry = new THREE.Geometry();
        var gvxs = geom.mesh.vxs;
        for (var i = 0; i < geom.length; i++) {
            var h = geom[i];
            //h = Math.max(Math.min(h, 0.1), -0.1);
            //console.log(h);
            geometry.vertices.push(new THREE.Vector3(gvxs[i][0] - 1, gvxs[i][1] - 1, h));
        }
        for (var j = 0; j < geotris.length; j++) {
            var t = geotris[j];
            geometry.faces.push(new THREE.Face3(t[0], t[1], t[2]));
        }
        //renderer.setClearColorHex(0x333F47, 1);
        //material = null;
        /*material = new THREE.MeshPhongMaterial({
            color: 0xdddddd,
            shading: THREE.FlatShading,
            //side: THREE.DoubleSide,
            shininess: 0,
            specular: 0x000000
        });*/
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        cube.rotation.x = Math.radians(90);

        water.rotation.z = 0;
        //water.rotation.x = -130;
        //water.position.y = 0.1;
        render();
    }
