/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   base.test.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/24 19:23:50 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/09 13:00:09 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import {
  cleanupFixtures,
  csrFixture,
  ssrHydratedFixture,
  ssrNonHydratedFixture,
} from "@lit-labs/testing/fixtures.js";
import { assert } from "@open-wc/testing";
import { createApp } from "./base.ts";

afterEach("render", () => {
  cleanupFixtures();
});

const fixtureModulesMap = new Map([[csrFixture, ["./base.ts"]]]);

for (const fixture of [ssrHydratedFixture, ssrNonHydratedFixture]) {
  fixtureModulesMap.set(fixture, ["/test/dist/client/base.js"]);
}

for (const [fixture, modules] of fixtureModulesMap) {
  describe(`Component rendered with ${fixture.name}`, () => {
    it("renders app as expected", async () => {
      await fixture(createApp(), {
        modules,
        base: import.meta.url,
      });

      assert.equal(
        document.querySelector("canvas")?.className,
        "m-0 h-full w-full p-0",
      );
      assert.instanceOf(document.getElementById("app"), HTMLCanvasElement);
    });
  });
}
