class RubiksCube {
  constructor() {
    this.faces = {
      U: Array(9).fill("w"),
      R: Array(9).fill("r"),
      F: Array(9).fill("g"),
      D: Array(9).fill("y"),
      L: Array(9).fill("o"),
      B: Array(9).fill("b"),
    };
    this.moveHistory = [];
  }

  rotateFace(face, clockwise = true) {
    const f = this.faces[face];
    const map = clockwise
      ? [6, 3, 0, 7, 4, 1, 8, 5, 2]
      : [2, 5, 8, 1, 4, 7, 0, 3, 6];
    const newFace = map.map(i => f[i]);
    this.faces[face] = newFace;
  }

  rotateEdges(face, clockwise = true) {
    const adjacent = {
      F: [["U", [6, 7, 8]], ["R", [0, 3, 6]], ["D", [2, 1, 0]], ["L", [8, 5, 2]]],
      B: [["U", [2, 1, 0]], ["L", [0, 3, 6]], ["D", [6, 7, 8]], ["R", [8, 5, 2]]],
      U: [["B", [2, 1, 0]], ["R", [2, 1, 0]], ["F", [2, 1, 0]], ["L", [2, 1, 0]]],
      D: [["F", [6, 7, 8]], ["R", [6, 7, 8]], ["B", [6, 7, 8]], ["L", [6, 7, 8]]],
      L: [["U", [0, 3, 6]], ["F", [0, 3, 6]], ["D", [0, 3, 6]], ["B", [8, 5, 2]]],
      R: [["U", [8, 5, 2]], ["B", [0, 3, 6]], ["D", [8, 5, 2]], ["F", [8, 5, 2]]],
    };

    const edges = adjacent[face];
    const temp = edges.map(([f, idx]) => idx.map(i => this.faces[f][i]));
    const rotated = clockwise ? [3, 0, 1, 2] : [1, 2, 3, 0];

    for (let i = 0; i < 4; i++) {
      const [f, idx] = edges[i];
      const vals = temp[rotated[i]];
      idx.forEach((j, k) => {
        this.faces[f][j] = vals[k];
      });
    }
  }

  rotate(face, clockwise = true) {
    this.moveHistory.push({ face, clockwise });
    this.rotateFace(face, clockwise);
    this.rotateEdges(face, clockwise);
  }

  scramble(moves = 20) {
    const faces = ["U", "D", "F", "B", "L", "R"];
    for (let i = 0; i < moves; i++) {
      const f = faces[Math.floor(Math.random() * 6)];
      const dir = Math.random() > 0.5;
      this.rotate(f, dir);
    }
  }

  solveStepByStep() {
    const reverseMoves = [...this.moveHistory].reverse();
    let step = 0;
    document.getElementById("stepsLog").innerHTML = "";

    const interval = setInterval(() => {
      if (step >= reverseMoves.length) {
        clearInterval(interval);
        this.moveHistory = [];
        return;
      }

      const move = reverseMoves[step];
      this.rotate(move.face, !move.clockwise);

      const log = document.createElement("div");
      log.textContent = `Step ${step + 1}: Undo ${move.face} (${!move.clockwise ? "clockwise" : "counter"}) → ${this.stringify()}`;
      document.getElementById("stepsLog").appendChild(log);

      this.display();
      step++;
    }, 800);
  }

  stringify() {
    return ["U", "R", "F", "D", "L", "B"].map(f => this.faces[f].join("")).join("");
  }

  displayFlatCubeLine(str) {
    const container = document.getElementById("flatCubeLine");
    container.innerHTML = "";
    for (let color of str) {
      const cell = document.createElement("div");
      cell.className = `flat-cell ${color}`;
      container.appendChild(cell);
    }
  }

  display() {
    const str = this.stringify();
    const faceOrder = ["U", "R", "F", "D", "L", "B"];
    for (let face of faceOrder) {
      const container = document.getElementById(face);
      if (!container) continue;
      container.innerHTML = "";
      this.faces[face].forEach((color) => {
        const cell = document.createElement("div");
        cell.className = `cube-cell ${color}`;
        container.appendChild(cell);
      });
    }
    this.displayFlatCubeLine(str);
  }
}

const cube = new RubiksCube();
cube.display();

document.getElementById("scrambleBtn").addEventListener("click", () => {
  cube.scramble();
  cube.display();
});

document.getElementById("solveBtn").addEventListener("click", () => {
  cube.solveStepByStep();
});
