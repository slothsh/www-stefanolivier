export type ComponentProps<T> = {
    class?: string
} & T;

export type BlogPostItem = {
    title: string,
    content: string,
};

export type CanvasProps<T = {}> = {
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    fps: number,
    singleFrameDuration: number,
    startTime: number,
    currentTime: DOMHighResTimeStamp,
    elapsedTime: number,
    deltaTime: number,
    clientWindow: { width: number, height: number, scale: number },
    clientCursor: { position: Vec2, offset: Vec2 },
} & T;
