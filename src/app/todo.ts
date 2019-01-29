export class Todo {
    public static NEW: string = "NEW";
    public static IN_PROGRESS: string = "IN_PROGRESS";
    public static IMPLEMENTED: string = "IMPLEMENTED";
    public static DEPLOYED: string = "DEPLOYED";
    public static CLOSED: string = "CLOSED";
    
    category: string = null;
    title: string = null;
    description: string = null;
    status: string = Todo.NEW;
}