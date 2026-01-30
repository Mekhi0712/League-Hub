type League = {
  name: string;
  season: string;
  total_rosters: number;
  status: string;
};

async function getLeague(leagueId: string): Promise<League> {
  const res = await fetch(`https://api.sleeper.app/v1/league/${leagueId}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Could not load league info");
  return res.json();
}

export default async function Home() {
  const leagueId = "1322818347875696640"; // your league id

  const league = await getLeague(leagueId);

  return (
    <main style={{ padding: "40px", fontSize: "20px" }}>
      <h1 style={{ fontSize: "32px" }}>{league.name}</h1>
      <p>Season: {league.season}</p>
      <p>Teams: {league.total_rosters}</p>
      <p>Status: {league.status}</p>
    </main>
  );
}

