import { VFC } from "react";
import { Layout } from "../components/Layout";
import { Createuser } from "../components/CreateUser"

const HooksMemo: VFC = () => {
    return (
        <Layout title="Hooks memo">
            <Createuser/>
        </Layout>
    )
}

export default HooksMemo