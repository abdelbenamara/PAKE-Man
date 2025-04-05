/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   renderer.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/13 12:12:50 by abenamar          #+#    #+#             */
/*   Updated: 2025/03/14 16:54:42 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { render } from "@lit-labs/ssr";
import { collectResultSync } from "@lit-labs/ssr/lib/render-result.js";
import { uneval } from "devalue";

async function createRenderFunction({ createApp }: { createApp: unknown }) {
  return (_server: unknown, _req: unknown, _reply: unknown) => {
    const data = {};

    return {
      element: collectResultSync(render((createApp as CallableFunction)())),
      hydration: `<script>window.hydration = ${uneval({ data })}</script>`,
    };
  };
}

export default { createRenderFunction };
