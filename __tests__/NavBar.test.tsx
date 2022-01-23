import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from "@testing-library/user-event"
import { getPage, initTestHelpers } from "next-page-tester"
import { setupServer } from "msw/node"
import { handlers } from '../mock/handlers'

initTestHelpers()

// テスト用のモックサーバーを立てる
const server = setupServer(...handlers)

beforeAll(() => {
    server.listen() // 起動
})
afterEach(() => {
    server.resetHandlers()
    cleanup()
})
afterAll(() => {
    server.close() // 終了
})

describe("Navigation Test Cases", () => {
    // テストケース
    it("Should route to selected page in navbar", async () => {
        // indexページを取得
        const { page } = await getPage({
            route: "/",
        })
        render(page)
        // Next.js + GraphQL　この文字を取得するまで待つ
        expect(await screen.findByText("Next.js + GraphQL")).toBeInTheDocument()
        
        // makevar-nav のボタンをクリック (LocalStateAに移動)
        userEvent.click(screen.getByTestId("makevar-nav"))
        // LocalStateA にある makeVarの文字をチェック
        expect(await screen.findByText("makeVar")).toBeInTheDocument()
    })
})



