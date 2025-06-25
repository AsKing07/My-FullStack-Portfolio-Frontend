"use client";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Loader2 } from "lucide-react";
import Link from "next/link";
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function DashboardHome() {
  const { data, loading, error } = useAnalytics("7d");

  if (loading) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
    </div>
  );
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!data) return null;

  // Formatage des données
  const realtime = data.realtime.visitors ?? data.realtime.results?.visitors ?? 0;
  const agg = data.aggregate?.results?.[0]?.metrics || [0,0,0,0];
  const [visitors, pageviews, visits, bounceRate] = agg;
  const timeseries = data.timeseries?.results || [];
  const topPages = data.topPages?.results || [];
  const countries = data.countries?.results || [];

  // Chart.js data
  const chartData = {
    labels: timeseries.map((item: any, i: number) =>
      item.dimensions?.[0]
        ? new Date(item.dimensions[0]).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
        : `Jour ${i + 1}`
    ),
    datasets: [
      {
        label: "Visiteurs",
        data: timeseries.map((item: any) => item.metrics?.[0] ?? 0),
        backgroundColor: "rgba(57, 73, 107, 0.1)",
        borderColor: "rgba(31, 184, 205, 1)",
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: "rgba(31, 184, 205, 1)",
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <main className="accueil_dashboard px-2 md:px-8 py-8 w-full">
      <div className="dashboard-title mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Tableau de bord analytique</h1>
      </div>

      {/* Statistiques */}
      <section className="stats-section mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stats-grid">
          <StatCard icon="⚡" label="Visiteurs actuels" value={realtime} />
          <StatCard icon="👥" label="Visiteurs uniques (7j)" value={visitors} />
          <StatCard icon="📄" label="Pages vues" value={pageviews} />
          <StatCard icon="⏱️" label="Nombre de visites" value={visits} />
        </div>
      </section>

      {/* Graphique */}
      <section className="chart-section mb-8">
        <div className="card bg-white dark:bg-slate-900 rounded-lg shadow p-6">
          <h3 className="section-title text-lg font-semibold mb-4">Visiteurs (7 derniers jours)</h3>
          <div className="chart-container" style={{ minHeight: 300 }}>
            <Line data={chartData} options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { x: { grid: { display: false } }, y: { beginAtZero: true } }
            }} />
          </div>
        </div>
      </section>

      {/* Tables */}
      <section className="tables-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 tables-grid">
          {/* Pages populaires */}
          <div className="card bg-white dark:bg-slate-900 rounded-lg shadow p-6">
            <h3 className="section-title text-lg font-semibold mb-4">Pages populaires</h3>
            <div className="table-container overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Page</th>
                    <th className="text-left">Visiteurs</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center text-muted-foreground">Aucune donnée disponible</td>
                    </tr>
                  ) : topPages.map((item: any) => (
                    <tr key={item.dimensions?.[0]}>
                      <td>{item.dimensions?.[0]}</td>
                      <td>{item.metrics?.[0] ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Trafic par pays */}
          <div className="card bg-white dark:bg-slate-900 rounded-lg shadow p-6">
            <h3 className="section-title text-lg font-semibold mb-4">Trafic par pays</h3>
            <div className="table-container overflow-x-auto">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Pays</th>
                    <th className="text-left">Visiteurs</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center text-muted-foreground">Aucune donnée disponible</td>
                    </tr>
                  ) : countries.map((item: any) => (
                    <tr key={item.dimensions?.[0]}>
                      <td>{item.dimensions?.[0]}</td>
                      <td>{item.metrics?.[0] ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <div className="dashboard-retour-site mt-8 flex justify-center">
        <Link href="/" className="text-blue-600 hover:underline font-semibold">ACCÉDER AU SITE</Link>
      </div>
    </main>
  );
}

// Petit composant pour les cartes stats
function StatCard({ icon, label, value }: { icon: string, label: string, value: number }) {
  return (
    <div className="stat-card card bg-white dark:bg-slate-900 rounded-lg shadow p-6 flex items-center gap-4">
      <div className="stat-icon text-3xl">{icon}</div>
      <div className="stat-info">
        <h3 className="text-2xl font-bold">{value ?? "--"}</h3>
        <p className="text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}