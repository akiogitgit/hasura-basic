import { VFC } from "react";
import Link from "next/link";
import { GetStaticProps, GetStaticPaths } from "next";
import { initializeApollo } from "../../lib/apolloClient";
import { GET_USERIDS, GET_USERBY_ID } from "../../queries/queries";
import {
    GetUserByIdQuery,
    GetUserIdsQuery,
    Users
} from "../../types/generated/graphql";
import { Layout } from "../../components/Layout";

interface Props {
    user:{
        __typename?: "users",
    } & Pick<Users, "id" | "name" | "created_at">
}

const HasuraSSG2: VFC<Props> = ({ user }) => {
    if(!user){ // データ存在しない
        return <Layout title="loadint">Loading...</Layout>
    }
    return(
        <Layout title={user.name}>
            <div className="p-5 border-2 rounded-2xl flex flex-col gap-2">
                <p>{user.name}</p>
                <p>{user.id}</p>
            {/* eslint-disable */}
                <Link href="/hasura-ssg">
                    <a>back</a>
                </Link>
            {/* eslint-enable */}
            </div>
        </Layout>
    )
}

export const getStaticPaths:GetStaticPaths= async () => {
    const apolloClient = initializeApollo()
    const { data } = await apolloClient.query<GetUserIdsQuery>({
        query: GET_USERIDS,
    })
    const paths = data.users.map((user)=>({
        params:{
            id: user.id
        }
    }))
    return{
        paths,
        fallback: true
    }
}

export const getStaticProps:GetStaticProps = async ({ params }) => {
    const apolloClient = initializeApollo()
    const { data } = await apolloClient.query<GetUserByIdQuery>({
        query: GET_USERBY_ID,
        variables: {id: params.id}
    })
    return{
        props: {
            user: data.users_by_pk
        },
        revalidate: 1
    }
}


export default HasuraSSG2