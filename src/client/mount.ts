/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mount.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 17:25:28 by abenamar          #+#    #+#             */
/*   Updated: 2025/03/25 13:46:32 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import "./base.css";

if (
  !Object.prototype.hasOwnProperty.call(
    HTMLTemplateElement.prototype,
    "shadowRoot",
  )
) {
  const { hydrateShadowRoots } = await import(
    "@webcomponents/template-shadowroot/template-shadowroot.js"
  );

  hydrateShadowRoots(document.body);
  document.body.removeAttribute("dsd-pending");
}

await import("@lit-labs/ssr-client/lit-element-hydrate-support.js");

const { hydrate } = await import("@lit-labs/ssr-client");
const { createApp } = await import("./base.ts");

hydrate(createApp(), document.getElementById("root")!);
