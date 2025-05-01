export type ComponentProps<T> = {
    class?: string
} & T;

export interface BlogPostSnippet {
    title: string,
    blurb: string,
    slug: string,
    posted_at: string,
    tags: string[],
    read_time: number,
}

export interface BlogPost {
    title: string,
    body_text: string,
    body_structured: {},
    tldr?: string,
    posted_at: string,
    tags: string[],
    read_time: number,
}

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

export type IndexItem {
    date: string,
}
