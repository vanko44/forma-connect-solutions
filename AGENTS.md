<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Keep operational photography needed on external Git/Vercel deployments as files under `public/images/` so asset paths work on every host.
- Grant direction administrator roles in database triggers after email confirmation, because UI email matching is not an authorization boundary.
- Store optional mission team names inside the offer JSON and share role definitions across editing and rendering, so legacy offers remain readable and client/print output stays consistent.

- Generate client-side offer downloads from the original PDF template, preserving annexes; embed PDF pages in PowerPoint to retain the exact visual layout without external account connections.
- Keep partner mission orders in an admin-RLS-protected table; derive payment status and balance from persisted amounts to prevent conflicting financial states.
- Keep security field logs and per-site instructions admin-RLS-protected and linked to existing security sites so operational history remains attributable.
