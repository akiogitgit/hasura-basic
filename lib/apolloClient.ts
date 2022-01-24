import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject
} from "@apollo/client";
import "cross-fetch/polyfill"

// export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__"

// apolloClientが作られてないときは、undefined
let apolloClient: ApolloClient<NormalizedCacheObject>|undefined


// Hasuraとつないでる？
const createApolloClient=()=>{
    return new ApolloClient({
        // ブラウザではなく、サーバーで処理してる時
        ssrMode: typeof window === "undefined",
        link: new HttpLink({
            // Hasuraのエンドポイント
            uri: process.env.NEXT_PUBLIC_HASURA_URI,
            headers: {
                "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_KEY,
            }
        }),

        cache: new InMemoryCache(),
    })
}

export const initializeApollo = (initialState = null)=>{
    //                    null 演算子（左あるなら左、nullなら右）
    const _apolloClient = apolloClient ?? createApolloClient()
    // サーバーで実行されるときは、毎回新しいapolloClientを作成
    if(typeof window === "undefined") return _apolloClient
    // クライアントのときは、一度だけapolloClientを作成(ここに入らないと、apolloClientはnull)
    if(!apolloClient) apolloClient = _apolloClient
    return _apolloClient
}