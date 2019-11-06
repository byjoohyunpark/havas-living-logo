<template>
  <div ref="container"></div>
</template>
<script>
const THREE = require("three");
var Stats = require("stats.js");
import { random } from "@/js/random";
import { EventBus } from "@/js/event-bus.js";
import { position } from "./data.js";

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

export default {
  name: "Logo",
  data() {
    return {
      container: "",
      scene: "",
      geometry: "",
      material: "",
      mesh: "",
      renderer: "",
      onWindowResize: "",
      isAnimating: false
    };
  },
  destroyed() {
    this.isAnimating = false;

    // remove items from scene to help memorey
    this.scene.remove(this.mesh);
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.forceContextLoss();

    window.removeEventListener("resize", this.onWindowResize);
  },
  beforeMount() {
    this.isAnimating = true;
  },
  mounted() {
    this.container = this.$refs.container;
    const container = this.$refs.container;

    container.appendChild(stats.dom);

    var camera, scene, renderer, mesh, geometry, material;
    let counter = 0;

    camera = new THREE.PerspectiveCamera(
      27,
      window.innerWidth / window.innerHeight,
      5,
      5000
    );
    camera.position.z = 3000;

    scene = new THREE.Scene();
    scene.add(camera);

    var particles = this.count;
    geometry = new THREE.BufferGeometry();

    var positions = [];
    let pos = [];
    var colors = [];
    var clr = new THREE.Color();
    let order = random.shuffle([0, 1, 2]);

    let w = 200; // size from initial png file
    let h = 170;
    let scale = 7;
    let iteration = 3;

    for (let j = 0; j < iteration; j++) {
      for (let i = 0; i < position.length / 3; i++) {
        let x =
          (position[i * 3] - w / 2) * scale +
          (scale / 2 - Math.random() * scale);
        let y =
          (position[i * 3 + 1] - h / 2) * scale +
          (scale / 2 - Math.random() * scale);
        let z = 0;
        pos.push([x, y, 0]);
      }
    }

    // randomize point order
    pos = random.shuffle(pos);
    for (let i = 0; i < pos.length; i++) {
      positions.push(...pos[i]);
      let x = pos[i][0];
      let y = pos[i][1];
      let z = 0;
      var vx = x / (w * scale) + 0.5;
      var vy = y / (h * scale) + 0.5;
      var vz = z / (w * scale) + 0.5;
      let array = [vx, vy, vz];
      clr.setRGB(array[order[0]], array[order[1]], array[order[2]]);
      colors.push(clr.r, clr.g, clr.b);
    }

    geometry.addAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();

    material = new THREE.PointsMaterial({
      size: 15,
      vertexColors: THREE.VertexColors
    });
    mesh = new THREE.Points(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);

    container.appendChild(renderer.domElement);

    window.addEventListener("resize", onWindowResize, false);

    function onWindowResize(event) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    const animate = () => {
      if (!this.isAnimating) return;

      requestAnimationFrame(animate);

      renderer.render(scene, camera);
      stats.update();
    };

    let u;
    let variation = { i: random.range(1, 10), m: random.range(1, 5) };

    const update = () => {
      if (!this.isAnimating) return;
      u = requestAnimationFrame(update);
      counter += 0.01;

      var pos = mesh.geometry.attributes.position.array;

      if (
        Math.sin(counter) < 0.01 &&
        Math.sin(counter) > 0 &&
        Math.cos(counter) > 0.992
      ) {
        EventBus.$emit("pause_box_animation");
      }

      for (var i = 0, il = pos.length; i < il; i++) {
        var x = Math.sin(counter + i * variation.i) * variation.m;
        pos[i] += x;
      }

      mesh.geometry.attributes.position.needsUpdate = true;
    };

    animate();
    update();

    EventBus.$on("pause_box_animation", () => {
      cancelAnimationFrame(u);
      variation = { i: random.range(2, 8), m: random.range(1, 5) };
      setTimeout(() => {
        update();
      }, 2000);
    });

    this.scene = scene;
    this.geometry = geometry;
    this.material = material;
    this.mesh = mesh;
    this.renderer = renderer;
    this.onWindowResize = onWindowResize();
  }
};
</script>
