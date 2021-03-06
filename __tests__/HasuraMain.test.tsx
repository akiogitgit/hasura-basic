/**
 * @jest-environment jsdom
 */
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import userEvent from "@testing-library/user-event"
import { getPage, initTestHelpers } from "next-page-tester"
import { setupServer } from "msw/node"
import { handlers } from '../mock/handlers'

// next page tester
initTestHelpers()

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

describe("Hasura Fetch Test Cases",()=>{
    it("Should render the list of users by useQuery", async () => {
        const { page } = await getPage({
            route: "/hasura-main",
        })
        render(page)
        expect(await screen.findByText("Hasura main page")).toBeInTheDocument()
        // expect(await screen.findByText("user1")).toBeInTheDocument()
    })
})