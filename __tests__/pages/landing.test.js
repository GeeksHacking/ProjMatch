import Landing from "@/pages/Landing/Landing";

import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/router";

describe("Landing Page", () => {
    it("checks if login works", () => {
        useRouter.mockReturnValue({ query: {} })
        render(<Landing />)
        expect(useRouter).toHaveBeenCalled()
        
        const loginElement = screen.getByText("Log In")
        expect(loginElement).toBeInTheDocument()

        expect(screen.getByTestId("landing-anim")).toBeInTheDocument()
        expect(screen.getByTestId("landing-titlebar")).toBeInTheDocument()
    })
})