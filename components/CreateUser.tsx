import { VFC } from "react";
// カスタムフック
import { useCreateForm } from "../hooks/useCreateForm";
import { Child } from "./Child";

export const Createuser: VFC = () => {
    const {
        text,
        username,
        handleSubmit,
        usernameChange,
        hello,
        handleTextChange
    } = useCreateForm()

    return (
        <>
            {console.log("CreateUser")}
            <p className="mb-3 font-bold">
                Custom Hook + useCallback + memo
            </p>

            <div className="mb-3 flex flex-col justify-center items-center">
                <label>Text</label>
                <input
                    className="px-3 py-2 border border-gray-300"
                    type="text"
                    value={text}
                    onChange={handleTextChange}
                />

                <form
                    className="flex flex-col justify-center items-center"
                    onSubmit={handleSubmit}
                >
                    <label>UserName</label>
                    <input
                        className="px-3 py-2 border border-gray-300"
                        type="text"
                        value={username}
                        onChange={usernameChange}
                    />
                    <button
                        className="disabled:opacity-40 my-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl focus:outline-none"
                        type="submit"
                        disabled={!username || !text}
                    >Submit</button>
                </form>
                <Child hello={hello} handleSubmit={handleSubmit}/>
            </div>
        </>
    )
}