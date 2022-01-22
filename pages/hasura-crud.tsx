import { VFC, useState, FormEvent } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
    GET_USERS,
    CREATE_USER,
    DELETE_USER,
    UPDATE_USER
} from "../queries/queries";
import {
    GetUsersQuery,
    CreateUserMutation,
    DeleteUserMutation,
    UpdateUserMutation
} from "../types/generated/graphql";
import { Layout } from "../components/Layout";
import { UserItem } from "../components/Useritem";


const HasuraCRUD:VFC=()=>{
    const [editedUser, setEditedUser] = useState({id: "", name: ""})

    // 取得
    const {data,error,loading}=useQuery<GetUsersQuery>(GET_USERS,{
        fetchPolicy:"cache-and-network",
    })
    // 更新 updateは自動で、cacheを更新してくれるから下見たいのいらない
    const [updata_users_by_pk] = useMutation<UpdateUserMutation>(UPDATE_USER)
    // 追加 追加するから、変わった情報をcacheに入れる必要がある
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
    // 削除
    const [delete_users_by_pk] = useMutation<DeleteUserMutation>(DELETE_USER,{
        update(cache,{ data: {delete_users_by_pk} }){
            cache.modify({
                fields: {
                    users(existingUsers, {readField}){ // readFieldで任意のfieldの値を読む
                        return existingUsers.filter( // 既存のcacheの中で、消したやつ以外をcacheにする
                            (user) => delete_users_by_pk.id !== readField("id",user)
                        ) //           今削除した id　　　　　　　 ループしてる
                    }
                }
            })
        }
    })

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault() // 画面更新しない
        // editeduser.idあるときは、編集の処理
        if(editedUser.id){
            try{ //   上で定義した gqlに引数を渡している
                await updata_users_by_pk({
                    variables: {
                        id: editedUser.id,    // 更新対象
                        name: editedUser.name,// この名前に変更
                    },
                })
            } catch(err){
                alert(err.message)
            }
            setEditedUser({ id: "", name: ""}) // reset
        }
        // 新規作成の処理
        else{
            try{ // 上で定義した gqlに引数を渡す。
                await insert_users_one({
                    variables: {
                        name: editedUser.name, // このnameで新しく作成
                    },
                })
            }catch(err){
                alert(err.message)
            }
            setEditedUser({ id: "", name: ""})
        }
    }

    // const handleDelete = async(e: FormEvent<HTMLFormElement>)=>{
    //     e.preventDefault();
    //     try{
    //         await delete_users_by_pk({
    //             variables:{
    //                 id: editedUser.id
    //             }
    //         })
    //     }catch(err){
    //         alert(err.message)
    //     }
    //     setEditedUser({id: "", name: ""})
    // }

    // select gqlのerror
    if(error) return <Layout title="Hasura CRUD">Error: {error.message}</Layout>
    return(
        <Layout title="Hasura CRUD">
            <p className="mb-3 mt-[100px] font-bold">
                Hasura CRUD
            </p>
            <form
                className="flex flex-col justify-center items-center"
                onSubmit={handleSubmit}
            >
                <input
                    type="text"
                    className="px-3 py-2 border border-gray-300"
                    value={editedUser.name}
                    onChange={(e)=>{
                        // setEditedUser.name(e.target.value)
                        setEditedUser({...editedUser, name: e.target.value})
                    }}
                />
                {/* 一回Edit押したらCreateできない */}
                {/* <input
                    type="text"
                    className="px-3 py-2 border border-gray-300"
                    value={editedUser.id}
                    onChange={(e)=>{
                        // setEditedUser.name(e.target.value)
                        setEditedUser({...editedUser, id: e.target.value})
                    }}
                /> */}
                <button
                    type="submit"
                    className="disabled:opacity-40 my-3 py-1 px-3 text-white bg-indigo-500 hover:bg-indigo-900 rounded-2xl focus:outline-none duration-300"
                    disabled={!editedUser.name}
                    data-testid="new"
                >
                    {editedUser.id ? "Update" : "Create"}
                </button>
            </form>
            {/* <form
                onSubmit={handleDelete}
                className="mt-6 flex flex-col justify-center items-center">
                <input
                    type="text"
                    className="px-3 py-2 border border-gray-300"
                    value={editedUser.id}
                    onChange={(e)=>{
                        // setEditedUser.name(e.target.value)
                        setEditedUser({...editedUser, id: e.target.value})
                    }}
                />
                <button
                    type="submit"
                    disabled={!editedUser.id}
                    className="disabled:opacity-40 my-3 py-1 px-3 text-white bg-indigo-500 hover:bg-indigo-900 rounded-2xl focus:outline-none duration-300"
                >
                    Delete
                </button>
            </form> */}
            {/* dataは上のselect */}
            {data?.users.map((user)=>{
                return(
                    <UserItem
                        key={user.id}
                        user={user}
                        delete_users_by_pk={delete_users_by_pk}
                        setEditedUser={setEditedUser}
                    />
                )
            })}
        </Layout>
    )
}

export default HasuraCRUD