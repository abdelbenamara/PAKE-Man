/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   renderer.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/13 12:12:50 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/18 16:42:07 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { render } from "@lit-labs/ssr";
import { collectResultSync } from "@lit-labs/ssr/lib/render-result.js";
import { uneval } from "devalue";
import { HTMLTemplateResult } from "lit-html";

async function createRenderFunction({
  createApp,
}: {
  createApp: () => HTMLTemplateResult;
}) {
  return () => {
    const data = {};

    return {
      element: collectResultSync(render(createApp())),
      hydration: `<script>window.hydration = ${uneval({ data })}</script>`,
    };
  };
}

export default { createRenderFunction };
