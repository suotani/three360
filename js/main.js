(() => {
  const clickAdv = document.getElementById('clickAdv');
  const message = document.getElementById('message');
  const contentsHeight = document.getElementById('adv-image').clientHeight;
  const contentsWidth = document.getElementById('adv-image').clientWidth;

  let element, scene, camera, renderer, controls;

  const init = () => {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(60, 1.80, 1, 1800);
    camera.position.set(0, 0, 0);
    scene.add(camera);

    // 初期の向き、見え方はここで調整
    // SphereGeometry(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float);
    const geometry = new THREE.SphereGeometry(5, 60, 40, -1.58);
    geometry.scale(-1, 1, 1);

    const texture = new THREE.TextureLoader().load(
      // ローカル、デプロイでURLを変更
      // "/images/winter.jpg"
      "/three360/images/winter.jpg"
    );

    const material = new THREE.MeshBasicMaterial({ map: texture});

    sphere = new THREE.Mesh(geometry, material);

    scene.add(sphere);

    renderer = new THREE.WebGLRenderer();
    // 表示サイズの調整
    renderer.setSize(contentsWidth, contentsHeight);

    element = renderer.domElement;
    document.getElementById("adv-image").appendChild(element);
    renderer.render(scene, camera);

    // デバイスの判別
    let isAndroid = false;
    let isIOS = false;
    if (navigator.userAgent.indexOf("Android") != -1) {
      isAndroid = true;
    } else if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
      isIOS = true;
    }
    if (isAndroid || isIOS) {
      // android, iosではジャイロセンサーで視点変更する。
      window.addEventListener("deviceorientation", setOrientationControls, true);
      message.textContent="スマートフォンを傾けて視点操作"
    } else {
      // その他デバイスではマウスドラッグで視点変更する。
      setOrbitControls();
      message.textContent="マウスでドラッグして視点操作"
    }

    render();
  }

  // ジャイロセンサーで視点変更する
  const setOrientationControls = (e) => {
    // android, ios以外では無効にする
    if (!e.alpha) {
      return;
    }
    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();
    window.removeEventListener("deviceorientation", setOrientationControls, true);
  }

  const setOrbitControls = () => {
    // android, ios以外のデバイスでマウスドラッグで視点操作する
    const htmlelm = document.getElementById("adv-image")
    controls = new THREE.OrbitControls(camera, htmlelm);
    controls.target.set(
      camera.position.x + 0.15,
      camera.position.y,
      camera.position.z
    );

    controls.enableDamping = true;

    // 視点変更(+にすると逆回転になる)
    controls.rotateSpeed = -0.07;
    // ズーム機能
    controls.enableZoom = false;

    // 表示する垂直アングル最大値の調整
    controls.maxPolarAngle = 2.60;
    controls.minPolarAngle = 0.50 ;
  }

  const render = () => {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
  }

  window.addEventListener("load", init, false);

})();
