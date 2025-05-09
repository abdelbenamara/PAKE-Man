/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   mount.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 17:25:28 by abenamar          #+#    #+#             */
/*   Updated: 2025/05/09 14:30:56 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { hydrateShadowRoots } from "@webcomponents/template-shadowroot/template-shadowroot.js";
import "./base.css";

hydrateShadowRoots(document.body);

await import("@lit-labs/ssr-client/lit-element-hydrate-support.js");

document.body.removeAttribute("dsd-pending");

const { hydrate } = await import("@lit-labs/ssr-client");
const { createApp } = await import("@pake-man/ui/base.ts");

hydrate(createApp(), document.getElementById("root")!);

import("@pake-man/ui/app.ts");
