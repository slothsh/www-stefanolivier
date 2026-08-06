export interface ContourColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface RendererConfig {
    dprMultiplier?: number;
    alpha?: boolean;
    maxColors?: number;
    lineWidth?: number;
}

const MAX_COLORS = 8;

const VERTEX_SHADER_SRC = `#version 300 es
in vec2 a_position;
in float a_level;
out float v_level;
void main() {
    v_level = a_level;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `#version 300 es
precision mediump float;
in float v_level;
uniform vec4 u_colors[${MAX_COLORS}];
uniform int u_colorCount;
out vec4 outColor;
void main() {
    int idx = int(mod(v_level, float(u_colorCount)));
    vec4 c = u_colors[idx];
    outColor = vec4(c.rgb * c.a, c.a);
}
`;

export class ContourRenderer {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext | null = null;
    private program: WebGLProgram | null = null;
    private positionBuffer: WebGLBuffer | null = null;
    private levelBuffer: WebGLBuffer | null = null;
    private vao: WebGLVertexArrayObject | null = null;
    private colorUniformLoc: WebGLUniformLocation | null = null;
    private colorCountLoc: WebGLUniformLocation | null = null;
    private positionCapacity = 0;
    private levelCapacity = 0;
    private segmentCount = 0;
    private colors: ContourColor[] = [{ r: 0.42, g: 0.56, b: 0.44, a: 0.6 }];
    private background: ContourColor = { r: 0, g: 0, b: 0, a: 0 };
    private lineWidth = 1;
    private dpr: number;
    private colorData = new Float32Array(MAX_COLORS * 4);

    constructor(canvas: HTMLCanvasElement, config?: RendererConfig) {
        this.canvas = canvas;
        this.dpr = config?.dprMultiplier ?? (typeof window !== 'undefined' ? window.devicePixelRatio : 1);
        this.lineWidth = config?.lineWidth ?? 1;

        const gl = canvas.getContext('webgl2', {
            alpha: config?.alpha ?? true,
            antialias: true,
            premultipliedAlpha: true,
            preserveDrawingBuffer: false,
        });

        if (!gl) {
            console.warn('ContourRenderer: WebGL2 not available, renderer disabled');
            return;
        }

        this.gl = gl;
        this.initProgram();
        this.initBuffers();

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.lineWidth(config?.lineWidth ?? 1);
    }

    private compileShader(type: number, source: string): WebGLShader | null {
        const gl = this.gl!;
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('ContourRenderer shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    private initProgram(): void {
        const gl = this.gl!;
        const vs = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
        const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
        if (!vs || !fs) return;

        const program = gl.createProgram();
        if (!program) return;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('ContourRenderer program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return;
        }

        this.program = program;
        this.colorUniformLoc = gl.getUniformLocation(program, 'u_colors');
        this.colorCountLoc = gl.getUniformLocation(program, 'u_colorCount');
    }

    private initBuffers(): void {
        const gl = this.gl!;
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);

        this.positionBuffer = gl.createBuffer();
        this.levelBuffer = gl.createBuffer();

        const positionLoc = gl.getAttribLocation(this.program!, 'a_position');
        const levelLoc = gl.getAttribLocation(this.program!, 'a_level');

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.levelBuffer);
        gl.enableVertexAttribArray(levelLoc);
        gl.vertexAttribPointer(levelLoc, 1, gl.FLOAT, false, 0, 0);

        gl.bindVertexArray(null);
    }

    updateData(vertices: Float32Array, levels: Float32Array, segmentCount: number): void {
        const gl = this.gl;
        if (!gl) return;

        this.segmentCount = segmentCount;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        if (vertices.length > this.positionCapacity) {
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
            this.positionCapacity = vertices.length;
        } else if (vertices.length > 0) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertices);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.levelBuffer);
        if (levels.length > this.levelCapacity) {
            gl.bufferData(gl.ARRAY_BUFFER, levels, gl.DYNAMIC_DRAW);
            this.levelCapacity = levels.length;
        } else if (levels.length > 0) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, levels);
        }
    }

    setColors(colors: ContourColor[]): void {
        if (colors.length > 0) {
            this.colors = colors.slice(0, MAX_COLORS);
        }
    }

    setBackground(r: number, g: number, b: number, a: number): void {
        this.background = { r, g, b, a };
    }

    setLineWidth(width: number): void {
        this.lineWidth = width;
        this.gl?.lineWidth(width);
    }

    resize(width: number, height: number): void {
        const gl = this.gl;
        if (!gl) return;
        const w = Math.max(1, Math.floor(width * this.dpr));
        const h = Math.max(1, Math.floor(height * this.dpr));
        if (this.canvas.width !== w || this.canvas.height !== h) {
            this.canvas.width = w;
            this.canvas.height = h;
        }
        gl.viewport(0, 0, w, h);
    }

    render(): void {
        const gl = this.gl;
        if (!gl || !this.program) return;

        const bg = this.background;
        gl.clearColor(bg.r * bg.a, bg.g * bg.a, bg.b * bg.a, bg.a);
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (this.segmentCount === 0) return;

        const count = Math.min(this.colors.length, MAX_COLORS);
        for (let i = 0; i < count; i++) {
            const c = this.colors[i];
            this.colorData[i * 4] = c.r;
            this.colorData[i * 4 + 1] = c.g;
            this.colorData[i * 4 + 2] = c.b;
            this.colorData[i * 4 + 3] = c.a;
        }

        gl.useProgram(this.program);
        gl.uniform4fv(this.colorUniformLoc, this.colorData);
        gl.uniform1i(this.colorCountLoc, count);

        gl.bindVertexArray(this.vao);
        gl.drawArrays(gl.LINES, 0, this.segmentCount * 2);
        gl.bindVertexArray(null);
    }

    destroy(): void {
        const gl = this.gl;
        if (!gl) return;

        if (this.positionBuffer) gl.deleteBuffer(this.positionBuffer);
        if (this.levelBuffer) gl.deleteBuffer(this.levelBuffer);
        if (this.vao) gl.deleteVertexArray(this.vao);
        if (this.program) gl.deleteProgram(this.program);

        this.positionBuffer = null;
        this.levelBuffer = null;
        this.vao = null;
        this.program = null;

        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) loseContext.loseContext();

        this.gl = null;
    }
}
