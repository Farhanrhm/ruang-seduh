import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as fc from "fast-check";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Hoist mock so it's available inside vi.mock factory
const mockSignIn = vi.hoisted(() => vi.fn());

vi.mock("next-auth/react", () => ({
  signIn: mockSignIn,
}));

// Mock lucide-react to avoid ESM issues
vi.mock("lucide-react", () => ({
  LogIn: () => <span data-testid="login-icon" />,
}));

import TombolLoginGate from "../TombolLoginGate";

describe("TombolLoginGate — Property 6", () => {
  beforeEach(() => {
    mockSignIn.mockClear();
  });

  it("selalu meneruskan callbackUrl yang diberikan ke signIn", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^\/[a-z0-9\-\/]{0,50}$/),
        async (callbackUrl) => {
          mockSignIn.mockClear();

          const { unmount } = render(
            <TombolLoginGate callbackUrl={callbackUrl} />
          );

          const button = screen.getByRole("button");
          await userEvent.click(button);

          expect(mockSignIn).toHaveBeenCalledOnce();
          expect(mockSignIn).toHaveBeenCalledWith("google", { callbackUrl });

          unmount();
        }
      ),
      { numRuns: 50 }
    );
  });
});
