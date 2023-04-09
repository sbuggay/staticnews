export type ItemType = 'story' | 'comment';

export interface IItem {
    id: number;
    deleted: boolean;
    type: ItemType;
    by: string;
    time: number;
    dead: boolean;
    kids: number[];
    score: number;

    comments?: IComment[];
}

export interface IComment extends IItem {
    parent: number;
    text: string;

    depth: number;
}

export interface IStory extends IItem {
    descendants: number;
    title: string;
    url: string;
}