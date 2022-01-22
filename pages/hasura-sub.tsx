import { VFC} from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_USERS, GET_USERS_LOCAL } from "../queries/queries";
import { GetUsersQuery } from "../types/generated/graphql";
import { Layout } from "../components/Layout";

//eslint-disable-next-line react-hooks/rules-of-hooks
const fetchSub:VFC=()=>{
    // cacheで取得してる
    const {data,error}=useQuery<GetUsersQuery>(GET_USERS_LOCAL)
    
    if(error){
        return(
            <Layout title="Hasura fetchPolicy">
                <p>Error: {error.message}</p>
            </Layout>
        )
    }
    return(
        <Layout title="Hasura fetchPolicy read cache">
            <p className="mb-6 font-bold">
                Direct read out from cache
            </p>
            {data?.users.map((user)=>{
                return(
                    <p className="my-1" key={user.id}>
                        {user.name}
                    </p>
                )
            })}

            <Link href="/hasura-main">
                <a className="mt-6">back</a>
            </Link>
        </Layout>
    )
}

export default fetchSub