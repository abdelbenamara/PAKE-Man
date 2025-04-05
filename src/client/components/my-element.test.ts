/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   my-element.test.ts                                 :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/24 19:23:50 by abenamar          #+#    #+#             */
/*   Updated: 2025/03/28 18:24:48 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
  cleanupFixtures,
  csrFixture,
  ssrHydratedFixture,
  ssrNonHydratedFixture,
} from "@lit-labs/testing/fixtures.js";
import { assert } from "@open-wc/testing";
import { html } from "lit";

afterEach("render", () => {
  cleanupFixtures();
});

describe(`Component rendered with csrFixture`, () => {
  it("renders my-element as expected", async () => {
    const el = await csrFixture(html`<my-element></my-element>`, {
      modules: ["./my-element.ts"],
      base: import.meta.url,
    });
    assert.equal(
      el.shadowRoot?.querySelector("h1")?.textContent,
      "Hello world!",
    );
  });
});

for (const fixture of [ssrNonHydratedFixture, ssrHydratedFixture]) {
  describe(`Component rendered with ${fixture.name}`, () => {
    it("renders my-element as expected", async () => {
      const el = await fixture(html`<my-element></my-element>`, {
        modules: ["/test/dist/client/components/my-element.js"],
        base: import.meta.url,
      });
      assert.equal(
        el.shadowRoot?.querySelector("h1")?.textContent,
        "Hello world!",
      );
    });
  });
}
