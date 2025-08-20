/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   index.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: abenamar <abenamar@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/18 11:22:26 by abenamar          #+#    #+#             */
/*   Updated: 2025/08/18 15:04:06 by abenamar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { BracketsManager, DataTypes, ValueToArray } from "brackets-manager";
import "brackets-viewer/dist/brackets-viewer.min.css";
import "brackets-viewer/dist/brackets-viewer.min.js";
import "brackets-viewer/dist/stage-form-creator.min.js";

type BracketsViewer = {
  onMatchClicked: (match: { id: number }) => Promise<void>;
  render: (data: unknown, config?: Partial<unknown>) => Promise<void>;
};

declare global {
  interface Window {
    bracketsManager: BracketsManager;
    bracketsViewer: BracketsViewer;
  }
}

type Participant = { id: number; name: string };
type BracketsData = ValueToArray<DataTypes>; // Viewer/Manager data shape (stage/match/match_game/participant)

const LS_KEY = "brackets";
const LS_NEXT = "brackets_next_id";

class Tournaments {
  private EL: {
    listSection: HTMLElement;
    listUl: HTMLElement;
    regSection: HTMLElement;
    tournamentName: HTMLInputElement;
    form: HTMLFormElement;
    nameInput: HTMLInputElement;
    clearBtn: HTMLButtonElement;
    createBtn: HTMLButtonElement;
    list: HTMLUListElement;
    actions: HTMLElement;
    backLink: HTMLAnchorElement;
    deleteLink: HTMLAnchorElement;
    viewerRoot: HTMLElement;
    mask: HTMLDivElement;
    maskTitle: HTMLHeadingElement;
    opp1: HTMLInputElement;
    opp2: HTMLInputElement;
    submitMask: HTMLButtonElement;
  };
  private participants: Participant[] = [];
  private nextId = 1;
  private creating = false; // re-entry guard
  private onCreateClick = (e: Event) => this.handleCreateClick(e);
  private onClearClick = () => this.handleClear();
  private currentMatchId: number | null = null;
  private enterListener?: (e: KeyboardEvent) => void;
  QUERY_ID: string | null;

  constructor() {
    this.EL = {
      listSection: document.getElementById("brackets-list")!,
      listUl: document.getElementById("brackets-ul")!,

      regSection: document.getElementById("registration")!,
      tournamentName: document.getElementById(
        "tournament-name",
      ) as HTMLInputElement,
      form: document.getElementById("participant-form") as HTMLFormElement,
      nameInput: document.getElementById(
        "participant-name",
      ) as HTMLInputElement,
      clearBtn: document.getElementById(
        "clear-participants",
      ) as HTMLButtonElement,
      createBtn: document.getElementById(
        "create-tournament",
      ) as HTMLButtonElement,
      list: document.getElementById("participant-list") as HTMLUListElement,

      actions: document.getElementById("viewer-actions")!,
      backLink: document.getElementById("back-link") as HTMLAnchorElement,
      deleteLink: document.getElementById("delete-link") as HTMLAnchorElement,

      viewerRoot: document.getElementById("tournaments")!,

      mask: document.getElementById("input-mask") as HTMLDivElement,
      maskTitle: document.getElementById("mask-title") as HTMLHeadingElement,
      opp1: document.getElementById("opponent1") as HTMLInputElement,
      opp2: document.getElementById("opponent2") as HTMLInputElement,
      submitMask: document.getElementById("input-submit") as HTMLButtonElement,
    };
    this.QUERY_ID = new URLSearchParams(window.location.search).get("id");

    if (!this.QUERY_ID) {
      // Creation mode
      this.EL.regSection.classList.remove("hidden");
      this.EL.listSection.classList.remove("hidden");

      this.bindRegistrationUI();
      this.renderSavedList();
    } else {
      // Viewing mode
      this.EL.actions.classList.remove("hidden");
      this.bindViewerActions();
      const data = this.loadData(this.QUERY_ID);
      this.renderBracket(data);
      this.setupMatchClickEditing(this.QUERY_ID);
    }
  }

  // -- Save/load utilities (like the official demo) ---------------------------------

  private getStore(): Record<string, BracketsData> {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  private setStore(store: Record<string, BracketsData>) {
    localStorage.setItem(LS_KEY, JSON.stringify(store));
  }

  private getNextId(): string {
    // Read the next-id counter. If missing/corrupted, initialize from max existing key + 1.
    const raw = localStorage.getItem(LS_NEXT);
    let next = raw !== null ? Number(raw) : NaN;

    if (!Number.isFinite(next)) {
      const store = this.getStore();
      const maxExisting = Object.keys(store)
        .map((k) => Number(k))
        .filter((n) => Number.isFinite(n))
        .reduce((max, n) => Math.max(max, n), -1);
      next = maxExisting + 1;
    }

    // Persist incremented counter and return the current id.
    localStorage.setItem(LS_NEXT, String(next + 1));
    return String(next);
  }

  private saveNew(data: BracketsData): string {
    const store = this.getStore();
    const id = this.getNextId();
    store[id] = data;
    this.setStore(store);
    return id;
  }

  private overwrite(id: string, data: BracketsData) {
    const store = this.getStore();
    store[id] = data;
    this.setStore(store);
  }

  private loadData(id: string): BracketsData {
    const store = this.getStore();
    if (!(id in store)) {
      alert("No bracket with this id.");
      window.location.search = "?id";
      throw new Error("Missing bracket");
    }
    return store[id];
  }

  private renderSavedList() {
    const store = this.getStore();
    this.EL.listUl.innerHTML = "";

    const entries = Object.entries(store);
    if (entries.length === 0) {
      this.EL.listUl.innerHTML = `<li class="text-sm text-gray-600">No saved tournaments yet.</li>`;
      return;
    }

    for (const [key, data] of entries) {
      const name = this.extractTournamentName(data, `Tournament #${key}`);
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `?id=${key}`;
      a.className = "text-blue-700 hover:underline";
      a.innerText = `${key} - ${name}`;
      li.appendChild(a);
      this.EL.listUl.appendChild(li);
    }
  }

  // -- Registration UI ---------------------------------------------------------------

  private bindRegistrationUI() {
    this.EL.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = this.EL.nameInput.value.trim();
      if (!name) return;
      if (
        this.participants.some(
          (p) => p.name.toLowerCase() === name.toLowerCase(),
        )
      ) {
        this.flashInputError("This player is already registered.");
        return;
      }
      this.participants.push({ id: this.nextId++, name });
      this.EL.nameInput.value = "";
      this.EL.nameInput.focus();
      this.renderList();
      this.updateCreateState();
    });

    // Ensure exactly ONE listener each time (idempotent binding)
    this.EL.createBtn.removeEventListener("click", this.onCreateClick);
    this.EL.createBtn.addEventListener("click", this.onCreateClick);

    this.EL.clearBtn.removeEventListener("click", this.onClearClick);
    this.EL.clearBtn.addEventListener("click", this.onClearClick);

    // Re-check enabled state when the name changes
    this.EL.tournamentName.addEventListener("input", () =>
      this.updateCreateState(),
    );

    this.renderList();
    this.updateCreateState();
  }

  private async handleCreateClick(e: Event) {
    e.preventDefault();

    // Ignore if disabled (defensive) or already creating
    if (this.EL.createBtn.hasAttribute("disabled") || this.creating) return;

    this.creating = true;
    this.EL.createBtn.setAttribute("aria-busy", "true");
    this.updateCreateState(); // disables button via creating flag

    try {
      const name = this.EL.tournamentName.value.trim() || "Tournament";
      const id = await this.createAndPersistBracket(name);
      // Navigate away — prevents any further clicks on this page
      window.location.href = `?id=${id}`;
    } catch (err) {
      console.error(err);
      // Only re-enable if we’re staying on the page (i.e., error)
      this.creating = false;
      this.EL.createBtn.removeAttribute("aria-busy");
      this.updateCreateState();
    }
  }

  private handleClear() {
    this.participants = [];
    this.nextId = 1;
    this.renderList();
    this.updateCreateState();
    this.EL.viewerRoot.innerHTML = "";
  }

  private renderList() {
    this.EL.list.innerHTML = "";
    if (this.participants.length === 0) {
      this.EL.list.innerHTML = `<li class="p-3 text-sm text-gray-500">No participants yet.</li>`;
      return;
    }

    for (const p of this.participants) {
      const li = document.createElement("li");
      li.className = "flex items-center justify-between p-3";
      li.innerHTML = `
        <span class="font-medium">${this.escape(p.name)}</span>
        <button
          type="button"
          class="px-2 py-1 text-xs rounded-md border hover:bg-gray-100"
          data-remove="${p.id}"
          aria-label="Remove ${this.escape(p.name)}"
        >Remove</button>
      `;
      this.EL.list.appendChild(li);
    }

    this.EL.list
      .querySelectorAll<HTMLButtonElement>("button[data-remove]")
      .forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = Number(btn.getAttribute("data-remove"));
          this.participants = this.participants.filter((p) => p.id !== id);
          this.renderList();
          this.updateCreateState();
        });
      });
  }

  private updateCreateState() {
    const nameOk = this.EL.tournamentName.value.trim().length > 0;
    const shouldDisable =
      this.participants.length < 2 || !nameOk || this.creating;
    // Toggle the `disabled` *attribute* so Tailwind’s `disabled:*` utilities apply.
    this.EL.createBtn.toggleAttribute("disabled", shouldDisable);
  }

  private flashInputError(msg: string) {
    this.EL.nameInput.classList.add("ring-2", "ring-red-400");
    this.EL.nameInput.title = msg;
    setTimeout(() => {
      this.EL.nameInput.classList.remove("ring-2", "ring-red-400");
      this.EL.nameInput.removeAttribute("title");
    }, 900);
  }

  private escape(s: string) {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  // --- helpers: power-of-two + BYE padding + tournament name ---
  private isPowerOfTwo(n: number) {
    return n > 0 && (n & (n - 1)) === 0;
  }

  private nextPowerOfTwo(n: number) {
    if (n <= 1) return 1;
    return 1 << (32 - Math.clz32(n - 1));
  }

  private padSeedingWithByes(seeding: (string | null)[]) {
    if (this.isPowerOfTwo(seeding.length)) return seeding;
    const target = this.nextPowerOfTwo(seeding.length);
    while (seeding.length < target) seeding.push(null); // BYE slots
    return seeding;
  }

  private extractTournamentName(data: BracketsData, fallback: string) {
    // Prefer the first stage with a non-empty name
    const stageArr = Array.isArray(data?.stage) ? data.stage : [];
    const namedStage = stageArr.find(
      (s: { name?: string }) =>
        typeof s?.name === "string" && s.name.trim().length > 0,
    );
    return (
      (namedStage?.name ?? stageArr[0]?.name ?? "").toString().trim() ||
      fallback
    );
  }

  // -- Create & persist bracket ------------------------------------------------------

  private async createAndPersistBracket(name: string): Promise<string> {
    let seeding: (string | null)[] = this.participants.map((p) => p.name);

    // NEW: pad to next power of two with BYEs (nulls)
    seeding = this.padSeedingWithByes(seeding);
    const data = await this.buildBracketData(seeding, name);
    const newId = this.saveNew(data);

    return newId;
  }

  // Build bracket data with the singleton and restore its previous state afterwards.
  private async buildBracketData(seeding: (string | null)[], name: string) {
    const snapshot = await window.bracketsManager.export(); // save current state
    try {
      await window.bracketsManager.create.stage({
        tournamentId: 0,
        name,
        type: "double_elimination",
        seeding,
        settings: { grandFinal: "double" },
      });

      const data = await window.bracketsManager.export(); // export the newly created bracket

      return data;
    } finally {
      await window.bracketsManager.import(snapshot); // restore whatever was there before
    }
  }

  // -- Viewing mode ------------------------------------------------------------------

  private bindViewerActions() {
    // Delete current id
    this.EL.deleteLink.addEventListener("click", () => {
      // Allow navigation, but remove the item first.
      const store = this.getStore();
      if (this.QUERY_ID && this.QUERY_ID in store) {
        delete store[this.QUERY_ID];
        this.setStore(store);
      }
    });
  }

  private renderBracket(data: BracketsData) {
    this.EL.viewerRoot.innerHTML = ""; // ensure empty root (avoid FOUC)
    window.bracketsViewer.render(
      {
        stages: data.stage,
        matches: data.match,
        matchGames: data.match_game,
        participants: data.participant,
      },
      {
        selector: "#tournaments",
        participantOriginPlacement: "before",
        separatedChildCountLabel: true,
        showSlotsOrigin: true,
        showLowerBracketSlotsOrigin: true,
        highlightParticipantOnHover: true,
      },
    );
  }

  // Returns true if the match is locked. Uses only the singleton manager.
  private async isMatchLocked(
    data: BracketsData,
    matchId: number,
  ): Promise<boolean> {
    const snapshot = await window.bracketsManager.export(); // save current state
    try {
      await window.bracketsManager.import(data); // load the bracket we’re viewing

      const m = Array.isArray(data.match)
        ? data.match.find((x) => x.id === matchId)
        : undefined;
      if (!m) return true;

      const status = m.status ?? 0;
      const s1 = m.opponent1?.score;
      const s2 = m.opponent2?.score;

      // Attempt a no-op update; locked/archived matches will throw.
      await window.bracketsManager.update.match({
        id: matchId,
        status,
        opponent1: typeof s1 === "number" ? { score: s1 } : undefined,
        opponent2: typeof s2 === "number" ? { score: s2 } : undefined,
      });

      return false; // success => not locked
    } catch (err) {
      const msg = String((err as Error)?.message || "");
      // Treat any locked/archived (or unexpected) error as locked.
      return /locked|archived/i.test(msg) || true;
    } finally {
      await window.bracketsManager.import(snapshot); // restore previous state
    }
  }

  // Click a match → open overlay → update scores → persist
  private setupMatchClickEditing(currentId: string) {
    window.bracketsViewer.onMatchClicked = async (match: { id: number }) => {
      const data = this.loadData(currentId);

      // NEW: block editing if the match is locked
      if (await this.isMatchLocked(data, match.id)) {
        // swap this for your own toast/snackbar if you prefer
        alert("This match is locked and cannot be edited.");
        return;
      }

      // (unchanged) open the overlay and proceed with editing
      this.currentMatchId = match.id;

      const el = document.querySelector<HTMLElement>(
        `[data-match-id="${match.id}"] .opponents > span`,
      );
      this.EL.maskTitle.textContent = el?.textContent || `Match #${match.id}`;
      this.EL.opp1.value = "";
      this.EL.opp2.value = "";

      const update = async () => {
        const s1 = parseInt(this.EL.opp1.value, 10) || 0;
        const s2 = parseInt(this.EL.opp2.value, 10) || 0;

        const loaded = this.loadData(currentId);
        await window.bracketsManager.import(loaded);

        try {
          await window.bracketsManager.update.match({
            id: match.id,
            status: 4,
            opponent1: { score: s1 },
            opponent2: { score: s2 },
          });

          const newData = await window.bracketsManager.export();

          this.renderBracket(newData);
          this.overwrite(currentId, newData);
        } catch (err) {
          alert((err as Error).message);
        } finally {
          this.hideMask();
        }
      };

      this.showMask(update);
    };
  }

  // --- Overlay helpers (Tailwind class toggles) ---
  private showMask(onSubmit: () => void) {
    // reveal overlay by removing 'hidden' and ensuring it's flex
    this.EL.mask.classList.remove("hidden");
    this.EL.mask.classList.add("flex");

    const submitOnce = () => onSubmit();
    this.EL.submitMask.onclick = submitOnce;

    this.enterListener = (e: KeyboardEvent) => {
      if (e.key === "Enter") submitOnce();
      if (e.key === "Escape") this.hideMask();
    };

    document.addEventListener("keydown", this.enterListener);
  }

  private hideMask() {
    // hide overlay by adding 'hidden' and removing 'flex'
    this.EL.mask.classList.add("hidden");
    this.EL.mask.classList.remove("flex");

    this.EL.submitMask.onclick = null;

    if (this.enterListener) {
      document.removeEventListener("keydown", this.enterListener);
      this.enterListener = undefined;
    }

    this.currentMatchId = null;
  }
}

async function loadTournaments() {
  const _tournaments = new Tournaments();
}

export { loadTournaments };
