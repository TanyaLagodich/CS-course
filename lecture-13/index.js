const graphviz = require('graphviz');
const path = require('path');

class Matrix {
    constructor(typeArrayConstructor, rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.size = rows * cols;
        this.array = new typeArrayConstructor(this.size);
    }

    set([row, col], value) {
        this.array[this.#getIndex(row, col)] = value;
    }

    get(row, col) {
        return this.array[this.#getIndex(row, col)];
    }

    #getIndex(row, col) {
        return row * this.cols + col;
    }

    *values() {
        for (let i = 0; i < this.array.length; i++) {
            yield this.array[i];
        }
    }

    [Symbol.iterator]() {
        return this.values();
    }
}

class Graph {
    constructor(matrix, isOriented = false) {
        this.matrix = matrix;
        this.isOriented = isOriented;
    }

    checkAdjacency(row, col) {
        const value = this.matrix.get(row - 1, col - 1);
        return Boolean(value);
    }

    createEdge(row, col, weight = 1) {
        this.matrix.set([row - 1, col - 1], weight);
        this.matrix.set([col - 1, row - 1], weight);
    }

    removeEdge(row, col) {
        this.matrix.set([row - 1, col - 1], 0);
        this.matrix.set([col - 1, row - 1], 0);
    }

    createArc(row, col, weight) {
        this.matrix.set([row - 1, col - 1], weight);
    }

    removeArc(row, col) {
        this.matrix.set([row, col], 0);
    }

    traverse(startNode, callback) {
        const visited = new Set(); // 2, 1
        const stack = [startNode]; // 1, 3, 4

        while (stack.length > 0) {
            const node = stack.pop(); // 1

            if (!visited.has(node)) {
                visited.add(node);

                for (let neighbor = 1; neighbor <= this.matrix.cols; neighbor++) { // 3
                    const adjacency = this.checkAdjacency(node, neighbor);
                    if (adjacency && !visited.has(neighbor)) {
                        stack.push(neighbor);
                        visited.add(neighbor);
                        callback({
                            id: neighbor,
                            weight: this.matrix.get(node - 1, neighbor - 1),
                        });
                    }
                }
            }
        }

    }

    visualizeGraph(outputFile) {
        const g = graphviz.digraph("G");
        const edges = new Set();

        for (let i = 1; i <= this.matrix.rows; i++) {
            g.addNode(i.toString());
        }

        for (let i = 1; i <= this.matrix.rows; i++) {
            for (let j = 1; j <= this.matrix.cols; j++) {
                if (this.checkAdjacency(i, j)) {
                    const weight = this.matrix.get(i - 1, j - 1);
                    const edgeKey = [i, j].sort().join('-');
                    if (edges.has(edgeKey) && !this.isOriented) continue;

                    const attrs = {
                        label: weight.toString()
                    };
                    if (!this.isOriented) {
                        attrs.dir = 'none';
                    }
                    g.addEdge(i.toString(), j.toString(), attrs);
                    edges.add(edgeKey);
                }
            }
        }

        console.log(g.to_dot());
        const outputPath = path.join(__dirname, outputFile);

        g.output("png", outputPath, (err, stdout, stderr) => {
            if (err) {
                console.error("Error generating graph:", err);
            } else {
                console.log("Graph generated successfully:", outputPath);
            }
        });
    }

    floydWarshall() {
        // посколько мы используем Uint8Array, то мы не можем ставить Infinity из JS
        // поэтому я использую число 255 вместо Infinity
        // чтобы мы могли хранить это значение в Uint8Array
        // Infinity в транзитивном замыкании означает отсутствие ребер
        const INF = 255;
        // 1. создаем копию матрицы смежности
        const transitiveMatrix = new Matrix(Uint8Array, this.matrix.rows, this.matrix.cols);

        // 1. заполняем матрицу + отсутствие ребер помечаем как Infinity
        for (let i = 0; i < this.matrix.rows; i++) {
            for (let j = 0; j < this.matrix.cols; j++) {
                const weight = this.matrix.get(i, j);
                if (weight === 0) {
                    if (i === j) transitiveMatrix.set([i, j], 0);
                    else transitiveMatrix.set([i, j], INF);
                } else {
                    transitiveMatrix.set([i, j], this.matrix.get(i, j));
                }
            }
        }

        // 2. Алгоритм Флойда-Уоршелла
        for (let k = 0; k < this.matrix.rows; k++) {
            for (let i = 0; i < this.matrix.rows; i++) {
                for (let j = 0; j < this.matrix.rows; j++) {
                    const pathFromIToK = transitiveMatrix.get(i, k);
                    const pathFromKToJ = transitiveMatrix.get(k, j);
                    const pathFromItoJ = transitiveMatrix.get(i, j);

                    // Является ли путь от вершины i до вершины j через вершину k короче, чем текущий известный путь от i до j
                    if (pathFromIToK < INF && pathFromKToJ < INF && pathFromItoJ > pathFromIToK + pathFromKToJ) {
                        transitiveMatrix.set([i, j], pathFromIToK + pathFromKToJ);
                    }
                }
            }
        }


        return transitiveMatrix;o9

    }

}


// Неориентированный граф
const adjacencyMatrix = new Matrix(Uint8Array, 4, 4);
adjacencyMatrix.set([0, 0], 0);
adjacencyMatrix.set([0, 1], 1);
adjacencyMatrix.set([0, 2], 1);
adjacencyMatrix.set([0, 3], 0);

adjacencyMatrix.set([1, 0], 1);
adjacencyMatrix.set([1, 1], 0);
adjacencyMatrix.set([1, 2], 1);
adjacencyMatrix.set([1, 3], 1);

adjacencyMatrix.set([2, 0], 1);
adjacencyMatrix.set([2, 1], 1);
adjacencyMatrix.set([2, 2], 0);
adjacencyMatrix.set([2, 3], 0);

adjacencyMatrix.set([3, 0], 0);
adjacencyMatrix.set([3, 1], 1);
adjacencyMatrix.set([3, 2], 0);
adjacencyMatrix.set([3, 3], 0);


const graph = new Graph(adjacencyMatrix);


// graph.traverse(2, (node) => {
//     console.log(node);
// });
// graph.visualizeGraph('./non-oriented-graph.png');

graph.floydWarshall();

// Ориентированный граф
const orientedMatrix = new Matrix(Uint8Array, 5, 5)
orientedMatrix.set([0, 0], 0);
orientedMatrix.set([0, 1], 1);
orientedMatrix.set([0, 2], 0);
orientedMatrix.set([0, 3], 0);
orientedMatrix.set([0, 4], 0);

orientedMatrix.set([1, 0], 0);
orientedMatrix.set([1, 1], 0);
orientedMatrix.set([1, 2], 0);
orientedMatrix.set([1, 3], 1);
orientedMatrix.set([1, 4], 1);

orientedMatrix.set([2, 0], 0);
orientedMatrix.set([2, 1], 1);
orientedMatrix.set([2, 2], 0);
orientedMatrix.set([2, 3], 0);
orientedMatrix.set([2, 4], 0);

orientedMatrix.set([3, 0], 0);
orientedMatrix.set([3, 1], 0);
orientedMatrix.set([3, 2], 0);
orientedMatrix.set([3, 3], 0);
orientedMatrix.set([3, 4], 1);

orientedMatrix.set([4, 0], 0);
orientedMatrix.set([4, 1], 0);
orientedMatrix.set([4, 2], 0);
orientedMatrix.set([4, 3], 1);
orientedMatrix.set([4, 4], 0);

const orientedGraph = new Graph(orientedMatrix, true);
// orientedGraph.traverse(2, (node) => {
//     console.log(node);
// });
// orientedGraph.visualizeGraph('./oriented-graph.png');
