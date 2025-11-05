
/** Raw data structure from your API */
export interface RawFileNode {
    id: number;
    parent_id: number;
    level: number;
    file_name: string;
    node_type: 'DIRECTORY' | 'FILE';
    full_path?: string;
}
