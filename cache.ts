import { makeVar } from "@apollo/client";

interface Task{
    title:string
}

// makeVarで定義したtodoVarは、
// 別ファイルからuseReactiveVarで使用できる
export const todoVar=makeVar<Task[]>([])