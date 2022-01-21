import { useReactiveVar } from "@apollo/client";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState, VFC } from "react";
import { todoVar } from "../cache";

export const LocalStateA:VFC=()=>{
    const [input,setInput]=useState("")
    // makeVarで定義したtodoVarは、
    // 別ファイルからuseReactiveVarで使用できる
    const todos = useReactiveVar(todoVar)

    const handleSubmit=(e:FormEvent<HTMLFormElement>)=>{
        // リロードさせない
        e.preventDefault()
        // スプレッドで展開して、末尾に挿入
        todoVar([...todoVar(),{title:input}])
        setInput("")
    }
    return(
        <>
            <p className="mb-3 font-bold">
                makeVar
            </p>
            {/* タスクを全表示 */}
            {todos?.map((task,index)=>{
                return(
                    <p className="mb-3 y-1" key={index}>
                        {task.title}
                    </p>
                )
            })}
            <form
                className="flex flex-col justify-center items-center"
                onSubmit={handleSubmit}
            >
                {/* 押すたびに、setInputに格納 */}
                <input
                    type="text"
                    className="mb-3 px-3 py-2 border border-gray-300"
                    placeholder="New task ?"
                    value={input}
                    onChange={(e:ChangeEvent<HTMLInputElement>)=>
                        setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="disabled:opacity-40 mb-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl focus:outline-none"
                    disabled={!input}
                >
                    Add new state
                </button>
            </form>

            <Link href="/local-state-b">
                <a>Next</a>
            </Link>
        </>
    )
}