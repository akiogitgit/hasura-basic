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

describe("SSG Test Cases", () => {
    it("Should render the list of users by useQuery", async () => {
        const { page } = await getPage({
            route: "/hasura-ssg",
        })
        render(page)
        expect(await screen.findByText("SSG+ISR")).toBeInTheDocument()
        expect(await screen.findByText("user1")).toBeInTheDocument()
        expect(await screen.findByText("user2")).toBeInTheDocument()
        expect(await screen.findByText("user3")).toBeInTheDocument()
    })
})

