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

describe("Hasura CRUD Test Cases", () => {
    it("Should render the list of users by useQuery", async () => {
        const { page } = await getPage({
            route: "/hasura-crud",
        })
        render(page)
        expect(await screen.findByText("Hasura CRUD")).toBeInTheDocument()
        expect(await screen.findByText("user1")).toBeInTheDocument()
        expect(await screen.findByText("user2")).toBeInTheDocument()
        expect(await screen.findByText("2022-01-20T00:00:10.109032+00:00")).toBeInTheDocument()
        expect(await screen.getByTestId("edit-3bd6365b-a8f8-4dbc-9731-767f8461bcc2")).toBeTruthy()
        expect(await screen.getByTestId("delete-3bd6365b-a8f8-4dbc-9731-767f8461bcc2")).toBeTruthy()
    })
})

