export const endpoint = 'http://localhost:9000';

export const contentType = 'application/x-www-form-urlencoded';

export interface TaskType {
    _id: number,
    task: string,
    status: boolean
}
