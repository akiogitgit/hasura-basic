import { VFC } from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { Layout } from "../components/Layout";
// hasuraで使うコマンド
import { GET_USERS } from "../queries/queries";
// 上のコマンドの型を定義している(上の型にあってるのが、これ)
import { GetUsersQuery } from "../types/generated/graphql";

const FetchMain:VFC=()=>{
    //     内容 err発生 ローディング中        右の型　　　　 使うコマンド
    const {data, error,loading} = useQuery<GetUsersQuery>(GET_USERS,{
        // fetchPolicy: "network-only",//毎度0から取得する
        fetchPolicy: "cache-and-network",//戻った時はcacheで表示し、その後新しく取得
        // fetchPolicy: "cache-first",//デフォルト、cacheあるならcache見る。取得が変わらない時使う
        // fetchPolicy: "no-cache", //cacheが作られない subが死ぬ
    })
    if(error){
        return(
            <Layout title="Hasura fetchPolicy">
                <p>Error: {error.message}</p>
            </Layout>
        )
    }
    return(
        <Layout title="Hasura fetchPolicy">
            <p className="mb-6 font-bold">
                Hasura main page
            </p>
            {console.log(data)}
            {data?.users.map((user)=>{
                return(
                    <p className="p-5 my-1 w-[300px] border-2 flex flex-col justify-center rounded" key={user.id}>
                        <div>name: {user.name}</div>
                        <div>id: {user.id}</div>
                        <div>created: {user.created_at}</div>
                    </p>
                )
            })}
            <Link href="/hasura-sub">
                <a className="mt-6">
                    Next
                </a>
            </Link>
        </Layout>
    )
}
export default FetchMain;