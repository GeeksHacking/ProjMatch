import Home from "@/pages/Home";
import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react";

describe("Home Page", () => {
    it("checks for Side Nav Bar", () => {
        render(<Home />);
        
    })
})