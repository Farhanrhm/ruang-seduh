import * as fc from "fast-check";
import { describe, it, expect } from "vitest";
import { checkGate, validateCallbackUrl, buildCallbackUrl } from "../../lib/auth-gate";

describe("auth-gate — Property 1: Gate memblokir semua guest dari halaman yang dilindungi", () => {
  /**
   * Validates: Requirements 2.1, 4.1
   */
  it("selalu mengembalikan 'blocked' untuk semua session tidak valid", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // null
          fc.constant(null),
          // undefined
          fc.constant(undefined),
          // session tanpa user
          fc.record({ user: fc.constant(undefined) }),
          // session dengan user tapi tanpa id
          fc.record({ user: fc.record({ name: fc.string() }) }),
          // session dengan user.id berupa number
          fc.record({ user: fc.record({ id: fc.integer() }) }),
          // session dengan user.id berupa boolean
          fc.record({ user: fc.record({ id: fc.boolean() }) }),
          // session dengan user.id berupa null
          fc.record({ user: fc.record({ id: fc.constant(null) }) }),
          // session dengan user.id berupa undefined
          fc.record({ user: fc.record({ id: fc.constant(undefined) }) })
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (invalidSession: any) => {
          expect(checkGate(invalidSession)).toBe("blocked");
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("auth-gate — Property 2: Gate mengizinkan semua authenticated user", () => {
  /**
   * Validates: Requirements 2.4, 4.4
   */
  it("selalu mengembalikan 'allowed' untuk session dengan user.id string non-empty", () => {
    fc.assert(
      fc.property(
        fc.record({
          user: fc.record({
            id: fc.string({ minLength: 1 }),
          }),
        }),
        (validSession) => {
          expect(checkGate(validSession as any)).toBe("allowed");
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("auth-gate — Property 3: CallbackUrl selalu mencerminkan path yang diakses", () => {
  /**
   * Validates: Requirements 2.2, 4.2
   */
  it("buildCallbackUrl mengembalikan path yang sama persis (identity)", () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^\/[a-z0-9\-\/]{0,80}$/),
        (path) => {
          expect(buildCallbackUrl(path)).toBe(path);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("auth-gate — Property 4: Fallback redirect ke '/' untuk callbackUrl tidak valid", () => {
  /**
   * Validates: Requirements 6.2
   */
  it("validateCallbackUrl selalu mengembalikan '/' untuk input tidak valid", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // null
          fc.constant(null),
          // undefined
          fc.constant(undefined),
          // string kosong
          fc.constant(""),
          // URL eksternal dengan http://
          fc.string({ minLength: 1 }).map((s) => `http://${s}`),
          // URL eksternal dengan https://
          fc.string({ minLength: 1 }).map((s) => `https://${s}`),
          // string arbitrer tanpa prefix "/"
          fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\-\.]{0,50}$/)
        ),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (invalidUrl: any) => {
          expect(validateCallbackUrl(invalidUrl)).toBe("/");
        }
      ),
      { numRuns: 100 }
    );
  });
});
