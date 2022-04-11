export class Todo {
    public static NEW: string = "NEW";
    public static IN_PROGRESS: string = "IN_PROGRESS";
    public static IMPLEMENTED: string = "IMPLEMENTED";
    public static DEPLOYED: string = "DEPLOYED";
    public static CLOSED: string = "CLOSED";

    id: number = -1;
    category: string = "Default";
    title: string = null;
    description: string = null;
    status: string = Todo.NEW;
    // Priority - #1 is the highest priority, #2 is second highest, etc
    priority: number = 1;
    createdDate: string = null;
    dateDeleted: string = null;
}
