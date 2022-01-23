import { ChangeEvent, FormEvent, memo, VFC } from "react";

interface Props {
    // この型は、CreateUserで渡すところのホバー
    hello: () => void
    handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
}

export const Child:VFC<Props> = memo(({ hello, handleSubmit }) => {
    return(
        <>
            {console.log("Child rendered")}
            <p>Child Component</p>
            <button 
                className="my-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl focus:outline-none"
                onClick={hello}
            >
                Click
            </button>
        </>
    )
})