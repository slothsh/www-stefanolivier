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
    structured_content: object,
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

export type IndexItem = {
    date: string,
}

export type FeaturedItemSource = 'github' | 'blog' | 'project' | 'external';

export interface FeaturedItem {
    id: number;
    sourceType: FeaturedItemSource;
    title: string;
    description: string;
    imageUrl: string | null;
    linkUrl: string;
    linkText: string;
    metadata: Record<string, unknown> | null;
}

export interface CvExperience {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
    highlights?: string[];
}

export interface CvEducation {
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
}

export interface CvContent {
    name: string;
    title: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
    experience: CvExperience[];
    education: CvEducation[];
    skills: string[];
}

export interface CvData {
    id: number;
    content: CvContent;
    tags: string[];
}
