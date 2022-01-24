/**
 * @jest-environment jsdom
 */
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

describe("UserDetail Test Cases", () => {
    it("Should render the list of users by useQuery", async () => {
        const { page } = await getPage({
            // route: "/users/75979c33-102b-4b56-80a5-bb682d61ce0",
            route: "/"
        })
        render(page)
        // expect(await screen.findByText("User detail")).toBeInTheDocument()
    })
})
