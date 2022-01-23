import { VFC } from "react";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import {ChevronDoubleLeftIcon} from "@heroicons/react/solid"
import { initializeApollo } from "../../lib/apolloClient";
import { GET_USERIDS, GET_USERBY_ID } from "../../queries/queries";
import {
    GetUserByIdQuery,
    GetUserIdsQuery,
    Users
} from "../../types/generated/graphql";
import { Layout } from "../../components/Layout";

interface Props{
    user: {
        __typename?: "users"
    } & Pick<Users, "id" | "name" | "created_at">
}

// 表示する部分
const Userdetail: VFC<Props> = ({ user }) => {
    if(!user){ // データ存在しない
        return <Layout title="loadint">Loading...</Layout>
    }
    return (
        <Layout title={user.name}>
            <p className="text-xl font-bold">
                User detail
            </p>
            <p className="m-4">
                {'ID:' + user.id}
            </p>
            <p className="mb-4 text-xl font-bold">
                {user.name}
            </p>
            <p className="mb-12">
                {user.created_at}
            </p>
            {/* eslint-disable */}
            <Link href="/hasura-ssg">
                <div className="flex cursor-pointer mt-12">
                    <ChevronDoubleLeftIcon
                        data-testid="auth-to-main"
                        className="h-5 w-5 mr-3 text-blue-500"
                    />
                    <span data-testid="back-to-main">
                        Back to main-ssg-page
                    </span>
                </div>
            </Link>
            {/* eslint-enable */}

        </Layout>
    )
}

// /user/001 とかのURLでアクセス可能な　user/[id]ページ
// URL のパラメーター部分（id）で指定可能な値を返す
export const getStaticPaths: GetStaticPaths = async() => {
    const apolloClient = initializeApollo()
    const {data} = await apolloClient.query<GetUserIdsQuery>({
        query: GET_USERIDS,
    })
    // nextで個別ページを作るテンプレ（user/[id].tsxの idを全てpathに加えている）
    const paths = data.users.map((user)=>({
        params:{
            id: user.id
        },
    }))
    // paths fallbackを返して、pathを通るようにする
    return{
        paths,
        fallback: true // 個別ページを動的に増やせる
    }
}

// 上で定義した paramsを使ってISRでgqlして、上のメインの関数でuserを使用する
export const getStaticProps: GetStaticProps = async ({ params }) => {
    const apolloClient = initializeApollo()
    const { data } = await apolloClient.query<GetUserByIdQuery>({
        query: GET_USERBY_ID,
        variables: { id: params.id }
    })
    return {
        props: { //user を定義 (interfaceで型をつけて、上の関数で使う)
            user: data.users_by_pk,
        },
        revalidate: 1,
    }
}

export default Userdetail