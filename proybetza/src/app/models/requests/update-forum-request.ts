
import { PostType } from "../forum.model";

export interface UpdatePostPayload {
    title?:string;
    content?:string;
    postType?:PostType;
}