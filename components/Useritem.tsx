//           最適化  useStateで作られた更新用関数のデータ型
import { VFC, memo, Dispatch, SetStateAction } from "react";
//      gql 型
import { Users, DeleteUserMutationFn } from "../types/generated/graphql";

// 下の引数の型を定義 user, delete_user_by_pk, setEditedUser
interface Props{
    user: {
        __typename?: "users"
    } & Pick<Users, "id" | "name" | "created_at">
    delete_users_by_pk: DeleteUserMutationFn
    setEditedUser: Dispatch<
        SetStateAction<{
            id: string
            name: string
        }>
    >
}

// 一つひとつの情報と、updateボタン、deleteボタンをそれぞれつける
//eslint-disable-next-line react/display-name
export const UserItem:VFC<Props>= memo(({
    user,
    delete_users_by_pk,
    setEditedUser,
})=>{
    console.log("UserItem rendered")
    return(
        <div className="my-2 p-4 border-2 rounded-2xl">
            <p className="mr-2">
                {user.name}
            </p>
            <p className="mr-2">
                {user.created_at}
            </p>
            <button
                className="mr-1 py-1 px-3 text-white bg-green-600 hover:bg-green-700 rounded-2xl focus:outline-none duration-300"
                data-testid={`edit-${user.id}`}
                onClick={()=>{
                    // hasura-crudのuseState
                    setEditedUser(user) // inputにセットする
                }}
            >
                Edit
            </button>
            <button
                className="mr-1 py-1 px-3 text-white bg-pink-600 hover:bg-pink-700 rounded-2xl focus:outline-none duration-300"
                data-testid={`delete-${user.id}`}
                onClick={async ()=>{
                    await delete_users_by_pk({
                        variables: {
                            id: user.id,
                        }
                    })
                }}
            >
                Delete
            </button>
        </div>
    )
})