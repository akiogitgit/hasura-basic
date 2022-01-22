import Link from "next/link";
import { VFC } from "react";
// GetStatic用の型
import { GetStaticProps } from "next";
// 自分で作ったやつ
import { initializeApollo } from "../lib/apolloClient";
import { GET_USERS } from "../queries/queries";
import { GetUsersQuery, Users } from "../types/generated/graphql";
import { Layout } from "../components/Layout";

// 一番下で定義した props: usersの型をつける
interface Props{
    users: ({
        __typename?: "users" // types/graphqlで定義したUsersの型からPick
    } & Pick<Users, "id" | "name" | "created_at">)[]// 配列
}

// Propsは今更だけど、引数の型　　上で定義したのを使う
const HasuraSSG: VFC<Props> = ({users})=>{
    return(
        <Layout title="Hasura SSG">
            <p className="mb-3 font-bold">SSG+ISR</p>
            {users?.map((user)=>{ // users? で usersが存在したら
                return( // user毎の個別のページ
                    <Link key={user.id} href={`/users/${user.id}`}>
                        <a className="my-1 cursor-pointer"
                            data-testid={`link-${user.id}`}>
                            {user.name}
                            </a>
                    </Link>
                )
            })}
        </Layout>
    )
}
export default HasuraSSG

// build時に、サーバーサイドで実行
export const getStaticProps: GetStaticProps = async () => {
    const apolloClient = initializeApollo()
    // queryの結果を data に格納
    const {data} = await apolloClient.query<GetUsersQuery>({
        query: GET_USERS,
    })
    return { // １Propsの users を返す
        props: { users: data.users},
        // これないと、SSG(build後の変更は無視)
        revalidate: 10, // 秒毎に再生成　ISR
    }
}