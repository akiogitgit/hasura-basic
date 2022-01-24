// モックサービスウォーカーでgqlのレスポンスを定義
import { graphql } from "msw";

export const handlers = [
    //            対象のクエリ  
    graphql.query("GetUsers", (req, res, ctx) => {
        return res(
            ctx.data({
                users: [
                    {
                        __typename: "users",
                        id: "75979c33-102b-4b56-80a5-bb682d61ce0d",
                        name: "user1",
                        created_at: "2022-01-20T01:20:02.86914+00:00"
                    },
                    {
                        __typename: "users",
                        id: "89c6ef52-003e-4f2d-b019-2ec88a802db5",
                        name: "user2",
                        created_at: "2022-01-20T00:00:10.109032+00:00"
                    },
                    {
                        __typename: "users",
                        id: "3bd6365b-a8f8-4dbc-9731-767f8461bcc2",
                        name: "user3",
                        created_at: "2022-01-20T00:00:28.663872+00:00"
                    },
                ]
            })
        )
    }),
    // getStaticPathsで使う個別で必要なレスポンス   これはダミー
    graphql.query("GetUserIDs", (req, res, ctx) => {
        return res(
            ctx.data({
                users: [
                    {
                        __typename: "users",
                        id: "75979c33-102b-4b56-80a5-bb682d61ce0d",
                    },
                    {
                        __typename: "users",
                        id: "89c6ef52-003e-4f2d-b019-2ec88a802db5",
                    },
                    {
                        __typename: "users",
                        id: "3bd6365b-a8f8-4dbc-9731-767f8461bcc2",
                    },
                ]
            })
        )
    }),
    graphql.query("GetUserById", (req, res, ctx) => {
        const { id } = req.variables
        if (id === "75979c33-102b-4b56-80a5-bb682d61ce0d"){
            return res(
                ctx.data({
                    users_by_pk:{
                        __typename: "users",
                        id: "75979c33-102b-4b56-80a5-bb682d61ce0d",
                        name: "user1",
                        created_at: "2022-01-20T01:20:02.86914+00:00"
                    },
                })
            )
        }
        if (id === "89c6ef52-003e-4f2d-b019-2ec88a802db5"){
            return res(
                ctx.data({
                    users_by_pk:{
                        __typename: "users",
                        id: "89c6ef52-003e-4f2d-b019-2ec88a802db5",
                        name: "user2",
                        created_at: "2022-01-20T00:00:10.109032+00:00"
                    },
                })
            )
        }
        if (id === "3bd6365b-a8f8-4dbc-9731-767f8461bcc2"){
            return res(
                ctx.data({
                    users_by_pk:{
                        __typename: "users",
                        id: "3bd6365b-a8f8-4dbc-9731-767f8461bcc2",
                        name: "user3",
                        created_at: "2022-01-20T00:00:28.663872+00:00"
                    },
                })
            )
        }
    }),
]

