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
            <Link href="./hasura-ssg">
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

export const getStaticPaths: GetStaticPaths = async() => {
    const apolloClient = initializeApollo()
    const {data} = await apolloClient.query<GetUserIdsQuery>({
        query: GET_USERIDS,
    })
    // nextで個別ページを作るテンプレ
    const paths = data.users.map((user)=>({
        params:{
            id: user.id
        },
    }))

    return{
        paths,
        fallback: true // 個別ページを動的に増やせる
    }
}

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