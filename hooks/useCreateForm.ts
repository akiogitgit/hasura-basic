// カスタムフック
import { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../queries/queries";
import { CreateUserMutation } from "../types/generated/graphql";

export const useCreateForm = () => {
    const  [text, setText] = useState("")
    const  [username, setUserName] = useState("")
    const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER,{
        update(cache,{ data: {insert_users_one} }){ //insert_users_oneに今作成した情報
            const cacheID = cache.identify(insert_users_one)// cache.identifyでcacheID取得
            cache.modify({
                fields:{
                    users(existingUsers,{toReference}){ // usersはテーブル名 existingUsersは既存のcache
                        return [toReference(cacheID),...existingUsers]// 既存のcacheの先頭にぶち込む
                    }
                }
            })
        }
    })

    // text変更
    const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value)
    },[]) // stateは使っていない

    // userName 変更
    const usernameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value)
    },[])
    
    // Childで使う。Childをmemoしても、helloが毎度新しく生成により、再レンダ。
    const hello = useCallback(()=>{
        console.log("hello")
    },[]) // []だと、初回のみ生成。

    // submit                          非同期処理-> 非同期関数にする
    const handleSubmit = useCallback( async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try{
            await insert_users_one({
                variables: {
                    name: username,
                } // 初期値は ""だから、第二に入れる。
            })
        }catch(err){
            alert(err.message)
        }
        setUserName("")
    },[username])// 関数内で使用するstateを書く

    return {
        text,
        username,
        handleSubmit,
        usernameChange,
        hello,
        handleTextChange
    }
}





