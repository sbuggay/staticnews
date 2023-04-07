export type ItemType = 'story' | 'comment';

export interface IItem {
    by: string;
    id: number;
    kids: number[];
    time: number;
    type: ItemType;

    comments?: IComment[];
}

export interface IComment extends IItem {
    parent: number;
    text: string;
}

export interface IStory extends IItem {
    descendants: number;
    score: number;
    title: string;
    url: string;
}