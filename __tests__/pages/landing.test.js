import Landing from "@/pages/Landing/Landing";

import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react";


describe("Landing Page", () => {
    it("checks if login works", () => {
        render(<Landing />)
        
        const loginElement = screen.getByText("Log In")
        expect(loginElement).toBeInTheDocument()

        expect(screen.getByTestId("landing-anim")).toBeInTheDocument()
        expect(screen.getByTestId("landing-titlebar")).toBeInTheDocument()
    })
})