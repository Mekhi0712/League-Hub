type Roster = {
  roster_id: number;
  owner_id: string | null;
};

type User = {
  user_id: string;
  display_name: string;
  metadata?: {
    team_name?: string;
  };
};

async function getRosters(leagueId: string): Promise<Roster[]> {
  const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Could not load rosters");
  return res.json();
}

async function getUsers(leagueId: string): Promise<User[]> {
  const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Could not load users");
  return res.json();
}

export default async function TeamsPage() {
  const leagueId = "1322818347875696640";

  const [rosters, users] = await Promise.all([getRosters(leagueId), getUsers(leagueId)]);

  const userMap = new Map(users.map((u) => [u.user_id, u]));

  const rows = rosters
    .slice()
    .sort((a, b) => a.roster_id - b.roster_id)
    .map((r) => {
      const owner = r.owner_id ? userMap.get(r.owner_id) : undefined;

      const ownerName = owner?.display_name ?? "Unknown Owner";

      // ✅ Team name priority:
      // 1) Sleeper team name (if set)
      // 2) "Owner's Team" (looks clean)
      // 3) "Team X" (last resort)
      const teamName =
        owner?.metadata?.team_name ??
        `${ownerName}'s Team`;

      return { roster_id: r.roster_id, teamName, ownerName };
    });

  return (
    <main style={{ padding: "40px", fontSize: "20px" }}>
      <h1 style={{ fontSize: "32px" }}>Teams</h1>

      <ul style={{ marginTop: "16px", lineHeight: "1.8" }}>
        {rows.map((t) => (
          <li key={t.roster_id}>
            <strong>{t.teamName}</strong> — {t.ownerName}
          </li>
        ))}
      </ul>
    </main>
  );
}
